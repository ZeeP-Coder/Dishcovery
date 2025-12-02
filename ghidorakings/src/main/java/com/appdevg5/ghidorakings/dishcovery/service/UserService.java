package com.appdevg5.ghidorakings.dishcovery.service;

import com.appdevg5.ghidorakings.dishcovery.entity.UserEntity;
import com.appdevg5.ghidorakings.dishcovery.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    UserRepository userRepository;

    // CREATE
    public UserEntity createUser(UserEntity user) {
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
            user.setPassword(newUserDetails.getPassword());

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
}
