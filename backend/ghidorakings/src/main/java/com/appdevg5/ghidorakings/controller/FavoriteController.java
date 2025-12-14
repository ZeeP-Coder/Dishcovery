package com.appdevg5.ghidorakings.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.appdevg5.ghidorakings.entity.FavoriteEntity;
import com.appdevg5.ghidorakings.entity.UserEntity;
import com.appdevg5.ghidorakings.service.FavoriteService;
import com.appdevg5.ghidorakings.service.UserService;

@RestController
@RequestMapping("/favorite")
public class FavoriteController {

    @Autowired
    FavoriteService favoriteService;
    
    @Autowired
    UserService userService;
    
    // Helper method to verify admin status
    private boolean isUserAdmin(Integer userId) {
        if (userId == null) return false;
        UserEntity user = userService.getUserById(userId);
        return user != null && user.isAdmin();
    }

    @PostMapping("/insertFavorite")
    public ResponseEntity<?> insertFavorite(@RequestBody FavoriteEntity favoriteEntity,
                                           @RequestHeader(value = "X-User-Id", required = false) Integer requesterId) {
        // Authentication required
        if (requesterId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Authentication required.");
        }
        
        // Ensure user can only create favorites for themselves
        if (!favoriteEntity.getUserId().equals(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("You can only create favorites for yourself.");
        }
        
        FavoriteEntity created = favoriteService.createFavorite(favoriteEntity);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/getAllFavorites")
    public List<FavoriteEntity> getAllFavorites() {
        return favoriteService.getAllFavorites();
    }

    @GetMapping("/getUserFavorites/{userId}")
    public ResponseEntity<?> getUserFavorites(@PathVariable Integer userId,
                                             @RequestHeader(value = "X-User-Id", required = false) Integer requesterId) {
        // Authentication required
        if (requesterId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Authentication required.");
        }
        
        // Users can only view their own favorites unless they're admin
        if (!userId.equals(requesterId) && !isUserAdmin(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("You can only view your own favorites.");
        }
        
        List<FavoriteEntity> favorites = favoriteService.getFavoritesByUserId(userId);
        return ResponseEntity.ok(favorites);
    }

    @PutMapping("/updateFavorite")
    public ResponseEntity<?> updateFavorite(@RequestParam int favoriteId, @RequestBody FavoriteEntity newFavoriteDetails,
                                           @RequestHeader(value = "X-User-Id", required = false) Integer requesterId) {
        // Authentication required
        if (requesterId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Authentication required.");
        }
        
        // Check ownership - only favorite owner or admin can update
        FavoriteEntity existingFavorite = favoriteService.getFavoriteById(favoriteId);
        if (existingFavorite == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!existingFavorite.getUserId().equals(requesterId) && !isUserAdmin(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("You can only update your own favorites.");
        }
        
        FavoriteEntity updated = favoriteService.updateFavorite(favoriteId, newFavoriteDetails);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/deleteFavorite/{favoriteId}")
    public ResponseEntity<?> deleteFavorite(@PathVariable int favoriteId,
                                           @RequestHeader(value = "X-User-Id", required = false) Integer requesterId) {
        // Authentication required
        if (requesterId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Authentication required.");
        }
        
        // Check ownership - only favorite owner or admin can delete
        FavoriteEntity existingFavorite = favoriteService.getFavoriteById(favoriteId);
        if (existingFavorite == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!existingFavorite.getUserId().equals(requesterId) && !isUserAdmin(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("You can only delete your own favorites.");
        }
        
        String result = favoriteService.deleteFavorite(favoriteId);
        return ResponseEntity.ok(result);
    }
}
