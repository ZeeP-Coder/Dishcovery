package com.appdevg5.ghidorakings.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.appdevg5.ghidorakings.entity.CommentEntity;
import com.appdevg5.ghidorakings.entity.UserEntity;
import com.appdevg5.ghidorakings.service.CommentService;
import com.appdevg5.ghidorakings.service.UserService;

@RestController
@RequestMapping("/comment") 
public class CommentController {

    @Autowired
    CommentService commentService;
    
    @Autowired
    UserService userService;
    
    // Helper method to verify admin status
    private boolean isUserAdmin(Integer userId) {
        if (userId == null) return false;
        UserEntity user = userService.getUserById(userId);
        return user != null && user.isAdmin();
    }

    @PostMapping("/insertComment")
    public ResponseEntity<?> insertComment(@RequestBody CommentEntity commentEntity,
                                          @RequestHeader(value = "X-User-Id", required = false) Integer requesterId) {
        // Authentication required
        if (requesterId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Authentication required.");
        }
        
        // Ensure user can only create comments for themselves
        if (!commentEntity.getUserId().equals(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("You can only create comments for yourself.");
        }
        
        CommentEntity created = commentService.createComment(commentEntity);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/getAllComments")
    public List<CommentEntity> getAllComments() {
        return commentService.getAllComments();
    }

    @PutMapping("/updateComment")
    public ResponseEntity<?> updateComment(@RequestParam int commentId, @RequestBody CommentEntity newCommentDetails,
                                          @RequestHeader(value = "X-User-Id", required = false) Integer requesterId) {
        // Authentication required
        if (requesterId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Authentication required.");
        }
        
        // Check ownership - only comment owner or admin can update
        CommentEntity existingComment = commentService.getCommentById(commentId);
        if (existingComment == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!existingComment.getUserId().equals(requesterId) && !isUserAdmin(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("You can only update your own comments.");
        }
        
        CommentEntity updated = commentService.updateComment(commentId, newCommentDetails);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/deleteComment/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable int commentId,
                                          @RequestHeader(value = "X-User-Id", required = false) Integer requesterId) {
        // Authentication required
        if (requesterId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Authentication required.");
        }
        
        // Check ownership - only comment owner or admin can delete
        CommentEntity existingComment = commentService.getCommentById(commentId);
        if (existingComment == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!existingComment.getUserId().equals(requesterId) && !isUserAdmin(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("You can only delete your own comments.");
        }
        
        String result = commentService.deleteComment(commentId);
        return ResponseEntity.ok(result);
    }
}
