package com.appdevg5.ghidorakings.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.appdevg5.ghidorakings.entity.RatingEntity;
import com.appdevg5.ghidorakings.entity.UserEntity;
import com.appdevg5.ghidorakings.service.RatingService;
import com.appdevg5.ghidorakings.service.UserService;

@RestController
@RequestMapping("/rating")
public class RatingController {

    @Autowired
    RatingService ratingService;
    
    @Autowired
    UserService userService;
    
    // Helper method to verify admin status
    private boolean isUserAdmin(Integer userId) {
        if (userId == null) return false;
        UserEntity user = userService.getUserById(userId);
        return user != null && user.isAdmin();
    }

    @PostMapping("/insertRating")
    public ResponseEntity<?> insertRating(@RequestBody RatingEntity ratingEntity,
                                         @RequestHeader(value = "X-User-Id", required = false) Integer requesterId) {
        // Authentication required
        if (requesterId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Authentication required.");
        }
        
        // Ensure user can only create ratings for themselves
        if (!ratingEntity.getUserId().equals(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("You can only create ratings for yourself.");
        }
        
        RatingEntity created = ratingService.createRating(ratingEntity);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/getAllRatings")
    public List<RatingEntity> getAllRatings() {
        return ratingService.getAllRatings();
    }

    @PutMapping("/updateRating")
    public ResponseEntity<?> updateRating(@RequestParam int ratingId, @RequestBody RatingEntity newRatingDetails,
                                         @RequestHeader(value = "X-User-Id", required = false) Integer requesterId) {
        // Authentication required
        if (requesterId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Authentication required.");
        }
        
        // Check ownership - only rating owner or admin can update
        RatingEntity existingRating = ratingService.getRatingById(ratingId);
        if (existingRating == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!existingRating.getUserId().equals(requesterId) && !isUserAdmin(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("You can only update your own ratings.");
        }
        
        RatingEntity updated = ratingService.updateRating(ratingId, newRatingDetails);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/deleteRating/{ratingId}")
    public ResponseEntity<?> deleteRating(@PathVariable int ratingId,
                                         @RequestHeader(value = "X-User-Id", required = false) Integer requesterId) {
        // Authentication required
        if (requesterId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Authentication required.");
        }
        
        // Check ownership - only rating owner or admin can delete
        RatingEntity existingRating = ratingService.getRatingById(ratingId);
        if (existingRating == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!existingRating.getUserId().equals(requesterId) && !isUserAdmin(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("You can only delete your own ratings.");
        }
        
        String result = ratingService.deleteRating(ratingId);
        return ResponseEntity.ok(result);
    }
}
