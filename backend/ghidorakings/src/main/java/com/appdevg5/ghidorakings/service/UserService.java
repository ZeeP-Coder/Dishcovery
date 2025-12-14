package com.appdevg5.ghidorakings.service;

import com.appdevg5.ghidorakings.entity.UserEntity;
import com.appdevg5.ghidorakings.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    // CREATE
    public UserEntity createUser(UserEntity user) {
        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }
        
        // Ensure a new user is inserted even if client includes a userId
        user.setUserId(null);
        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // READ ALL
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    // READ BY ID
    public UserEntity getUserById(int userId) {
        return userRepository.findById(userId).orElse(null);
    }

    // UPDATE
    public UserEntity updateUser(int userId, UserEntity newUserDetails) {
        try {
            UserEntity user = userRepository.findById(userId)
                    .orElseThrow(() -> new Exception("User not found"));

            user.setUsername(newUserDetails.getUsername());
            user.setEmail(newUserDetails.getEmail());
            
            // Only hash and update password if a new one is provided
            if (newUserDetails.getPassword() != null && !newUserDetails.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(newUserDetails.getPassword()));
            }
            
            // Optionally update admin status if provided
            user.setAdmin(newUserDetails.isAdmin());

            return userRepository.save(user);

        } catch (Exception e) {
            logger.error("Error updating user with ID {}", userId, e);
            return null;
        }
    }

    // DELETE
    public String deleteUser(int userId) {
        try {
            userRepository.deleteById(userId);
            return "User with ID " + userId + " has been deleted successfully.";
        } catch (Exception e) {
            logger.error("Error deleting user with ID {}", userId, e);
            return "Error deleting user with ID " + userId;
        }
    }

    // LOGIN
    public UserEntity login(String email, String password) {
        // Find user by email
        UserEntity user = userRepository.findByEmail(email).orElse(null);
        
        // If user exists and password matches
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        
        return null;
    }
}
