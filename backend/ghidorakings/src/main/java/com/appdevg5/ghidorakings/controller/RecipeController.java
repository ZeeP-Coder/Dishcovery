package com.appdevg5.ghidorakings.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.appdevg5.ghidorakings.entity.RecipeEntity;
import com.appdevg5.ghidorakings.service.RecipeService;


@RestController
@RequestMapping("/recipe")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class RecipeController {
    @Autowired
    RecipeService recipeService;

    @GetMapping("/print")
    public String getMethodName(@RequestParam String param) {
        return new String();
    }
    
    @PostMapping("/insertRecipe")
    public ResponseEntity<?> insertRecipe(@RequestBody RecipeEntity recipeEntity) {
        try {
            if (recipeEntity == null) {
                return ResponseEntity.badRequest().body("Recipe entity cannot be null");
            }
            if (recipeEntity.getTitle() == null || recipeEntity.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Recipe title is required");
            }
            if (recipeEntity.getUserId() == null || recipeEntity.getUserId() <= 0) {
                return ResponseEntity.badRequest().body("Valid user ID is required");
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
    public List<RecipeEntity> getAllRecipes() {
        return recipeService.getAllRecipes();
    }

    @PutMapping("/updateRecipe/{recipeId}")
    public ResponseEntity<RecipeEntity> updateRecipe(@PathVariable Integer recipeId, @RequestBody RecipeEntity newRecipeDetails) {
        RecipeEntity updated = recipeService.updateRecipe(recipeId, newRecipeDetails);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/deleteRecipe/{recipeId}")
    public ResponseEntity<String> deleteRecipe(@PathVariable Integer recipeId) {
        String result = recipeService.deleteRecipe(recipeId);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }
    
    
}