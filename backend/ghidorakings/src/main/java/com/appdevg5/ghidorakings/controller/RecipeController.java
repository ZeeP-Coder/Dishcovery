package com.appdevg5.ghidorakings.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.appdevg5.ghidorakings.entity.RecipeEntity;
import com.appdevg5.ghidorakings.entity.UserEntity;
import com.appdevg5.ghidorakings.service.RecipeService;
import com.appdevg5.ghidorakings.service.UserService;


@RestController
@RequestMapping("/recipe")
public class RecipeController {
    @Autowired
    RecipeService recipeService;
    
    @Autowired
    UserService userService;
    
    // Helper method to verify admin status from database
    private boolean isUserAdmin(Integer userId) {
        if (userId == null) return false;
        UserEntity user = userService.getUserById(userId);
        return user != null && user.isAdmin();
    }

    @GetMapping("/print")
    public String getMethodName(@RequestParam String param) {
        return new String();
    }
    
    @PostMapping("/insertRecipe")
    public ResponseEntity<?> insertRecipe(@RequestBody RecipeEntity recipeEntity,
                                         @RequestHeader(value = "X-User-Id", required = false) Integer requesterId) {
        try {
            // Authentication required
            if (requesterId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required.");
            }
            
            if (recipeEntity == null) {
                return ResponseEntity.badRequest().body("Recipe entity cannot be null");
            }
            if (recipeEntity.getTitle() == null || recipeEntity.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Recipe title is required");
            }
            
            // Ensure user can only create recipes for themselves
            if (!recipeEntity.getUserId().equals(requesterId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You can only create recipes for yourself.");
            }
            
            RecipeEntity created = recipeService.createRecipe(recipeEntity);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating recipe: " + e.getMessage());
        }
    }

    @GetMapping("/getAllRecipes")
    public ResponseEntity<?> getAllRecipes() {
        try {
            // Only return approved recipes for regular users
            List<RecipeEntity> recipes = recipeService.getApprovedRecipes();
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error fetching recipes: " + e.getMessage());
        }
    }

    @GetMapping("/getRecipesByUserId/{userId}")
    public ResponseEntity<List<RecipeEntity>> getRecipesByUserId(@PathVariable Integer userId) {
        List<RecipeEntity> userRecipes = recipeService.getRecipesByUserId(userId);
        return ResponseEntity.ok(userRecipes);
    }

    @PutMapping("/updateRecipe/{recipeId}")
    public ResponseEntity<?> updateRecipe(@PathVariable Integer recipeId, @RequestBody RecipeEntity newRecipeDetails,
                                         @RequestHeader(value = "X-User-Id", required = false) Integer requesterId) {
        // Authentication required
        if (requesterId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Authentication required.");
        }
        
        // Check ownership - only recipe owner or admin can update
        RecipeEntity existingRecipe = recipeService.getRecipeById(recipeId);
        if (existingRecipe == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!existingRecipe.getUserId().equals(requesterId) && !isUserAdmin(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("You can only update your own recipes.");
        }
        
        RecipeEntity updated = recipeService.updateRecipe(recipeId, newRecipeDetails);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/deleteRecipe/{recipeId}")
    public ResponseEntity<?> deleteRecipe(@PathVariable Integer recipeId,
                                         @RequestHeader(value = "X-User-Id", required = false) Integer requesterId) {
        // Authentication required
        if (requesterId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Authentication required.");
        }
        
        // Check ownership - only recipe owner or admin can delete
        RecipeEntity existingRecipe = recipeService.getRecipeById(recipeId);
        if (existingRecipe == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!existingRecipe.getUserId().equals(requesterId) && !isUserAdmin(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("You can only delete your own recipes.");
        }
        
        String result = recipeService.deleteRecipe(recipeId);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }

    // ADMIN: Get all pending recipes (not approved)
    @GetMapping("/admin/pending")
    public ResponseEntity<?> getPendingRecipes(@RequestHeader(value = "X-User-Id", required = false) Integer userId) {
        if (!isUserAdmin(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. Admin privileges required.");
        }
        List<RecipeEntity> pendingRecipes = recipeService.getPendingRecipes();
        return ResponseEntity.ok(pendingRecipes);
    }

    // ADMIN: Get all approved recipes
    @GetMapping("/admin/approved")
    public ResponseEntity<?> getApprovedRecipes(@RequestHeader(value = "X-User-Id", required = false) Integer userId) {
        if (!isUserAdmin(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. Admin privileges required.");
        }
        List<RecipeEntity> approvedRecipes = recipeService.getApprovedRecipes();
        return ResponseEntity.ok(approvedRecipes);
    }

    // ADMIN: Approve a recipe
    @PutMapping("/admin/approve/{recipeId}")
    public ResponseEntity<?> approveRecipe(@PathVariable Integer recipeId, @RequestHeader(value = "X-User-Id", required = false) Integer userId) {
        if (!isUserAdmin(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. Admin privileges required.");
        }
        try {
            RecipeEntity approved = recipeService.approveRecipe(recipeId);
            if (approved == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(approved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error approving recipe: " + e.getMessage());
        }
    }

    // ADMIN: Reject/delete a recipe
    @DeleteMapping("/admin/reject/{recipeId}")
    public ResponseEntity<?> rejectRecipe(@PathVariable Integer recipeId, @RequestHeader(value = "X-User-Id", required = false) Integer userId) {
        if (!isUserAdmin(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. Admin privileges required.");
        }
        String result = recipeService.deleteRecipe(recipeId);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }
    
    
}