package com.appdevg5.ghidorakings.controller;

import com.appdevg5.ghidorakings.entity.UserEntity;
import com.appdevg5.ghidorakings.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    UserService userService;

    // CREATE USER
    @PostMapping("/add")
    public UserEntity createUser(@RequestBody UserEntity user) {
        return userService.createUser(user);
    }

    // READ ALL USERS (Admin only)
    @GetMapping("/getAll")
    public ResponseEntity<?> getAllUsers(@RequestHeader(value = "X-User-Id", required = false) Integer userId) {
        // Verify the requester is an admin
        if (userId == null || !isUserAdmin(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Access denied. Admin privileges required.");
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
    // Helper method to verify admin status from database
    private boolean isUserAdmin(Integer userId) {
        if (userId == null) return false;
        UserEntity user = userService.getUserById(userId);
        return user != null && user.isAdmin();
    }

    // READ USER BY ID
    @GetMapping("/get/{id}")
    public UserEntity getUserById(@PathVariable int id) {
        return userService.getUserById(id);
    }

    // UPDATE USER
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable int id, @RequestBody UserEntity user,
                                       @RequestHeader(value = "X-User-Id", required = false) Integer requesterId) {
        // Users can only update their own profile, unless they're admin
        if (requesterId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Authentication required.");
        }
        
        if (requesterId != id && !isUserAdmin(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("You can only update your own profile.");
        }
        
        // Get the existing user from database to preserve isAdmin status
        UserEntity existingUser = userService.getUserById(id);
        if (existingUser == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Prevent users from modifying their own admin status
        // Only existing admins can modify admin status of others
        if (!isUserAdmin(requesterId)) {
            user.setAdmin(existingUser.isAdmin()); // Preserve original admin status
        }
        
        UserEntity updated = userService.updateUser(id, user);
        return ResponseEntity.ok(updated);
    }

    // DELETE USER (Admin only)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id,
                                       @RequestHeader(value = "X-User-Id", required = false) Integer requesterId) {
        // Only admins can delete users
        if (!isUserAdmin(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Access denied. Admin privileges required.");
        }
        
        String result = userService.deleteUser(id);
        return ResponseEntity.ok(result);
    }

    // LOGIN
    @PostMapping("/login")
    public UserEntity login(@RequestBody UserEntity user) {
        return userService.login(user.getEmail(), user.getPassword());
    }
}