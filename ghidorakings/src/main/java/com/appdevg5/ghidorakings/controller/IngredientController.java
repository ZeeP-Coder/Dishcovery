package com.appdevg5.ghidorakings.controller;

import com.appdevg5.ghidorakings.entity.IngredientEntity;
import com.appdevg5.ghidorakings.service.IngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/ingredients")
public class IngredientController {

    @Autowired
    private IngredientService ingredientService; // define service here

    // CREATE
    @PostMapping
    public IngredientEntity createIngredient(@RequestBody IngredientEntity ingredient) {
        return ingredientService.createIngredient(ingredient);
    }

    // READ ALL
    @GetMapping
    public List<IngredientEntity> getAllIngredients() {
        return ingredientService.getAllIngredients();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Optional<IngredientEntity> getIngredientById(@PathVariable int id) {
        return ingredientService.getIngredientById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public IngredientEntity updateIngredient(@PathVariable int id, @RequestBody IngredientEntity ingredient) {
        return ingredientService.updateIngredient(id, ingredient);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteIngredient(@PathVariable int id) {
        ingredientService.deleteIngredient(id);
        return "Ingredient with ID " + id + " deleted successfully.";
    }
}