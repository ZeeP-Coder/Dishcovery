package com.appdev.ghidorakings.ding5.controller;

import com.appdev.ghidorakings.ding5.entity.UserEntity;
import com.appdev.ghidorakings.ding5.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // READ ALL USERS
    @GetMapping("/getAll")
    public List<UserEntity> getAllUsers() {
        return userService.getAllUsers();
    }

    // READ USER BY ID
    @GetMapping("/get/{id}")
    public UserEntity getUserById(@PathVariable int id) {
        return userService.getUserById(id);
    }

    // UPDATE USER
    @PutMapping("/update/{id}")
    public UserEntity updateUser(@PathVariable int id, @RequestBody UserEntity user) {
        return userService.updateUser(id, user);
    }

    // DELETE USER
    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable int id) {
        return userService.deleteUser(id);
    }
}
