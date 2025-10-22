package com.appdev.ghidorakings.ding5.service;

import com.appdev.ghidorakings.ding5.entity.UserEntity;
import com.appdev.ghidorakings.ding5.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

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
        UserEntity user = new UserEntity();

        try {
            user = userRepository.findById(userId)
                    .orElseThrow(() -> new Exception("User not found"));

            user.setUsername(newUserDetails.getUsername());
            user.setEmail(newUserDetails.getEmail());
            user.setPassword(newUserDetails.getPassword());

            return userRepository.save(user);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // DELETE
    public String deleteUser(int userId) {
        try {
            userRepository.deleteById(userId);
            return "User with ID " + userId + " has been deleted successfully.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error deleting user with ID " + userId;
        }
    }
}
