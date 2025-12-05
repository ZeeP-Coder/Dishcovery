package com.appdevg5.ghidorakings.service;

import com.appdevg5.ghidorakings.entity.IngredientEntity;
import com.appdevg5.ghidorakings.repository.IngredientRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IngredientService {

    @Autowired
    private IngredientRepository ingredientRepository; // define repository here

    // CREATE
    public IngredientEntity createIngredient(IngredientEntity ingredient) {
        // ensure new insert by clearing id if client provided one
        ingredient.setIngredientId(null);
        return ingredientRepository.save(ingredient);
    }

    // READ ALL
    public List<IngredientEntity> getAllIngredients() {
        return ingredientRepository.findAll();
    }

    // READ BY ID
    public Optional<IngredientEntity> getIngredientById(int id) {
        return ingredientRepository.findById(id);
    }

    // UPDATE
    public IngredientEntity updateIngredient(int id, IngredientEntity updatedIngredient) {
        Optional<IngredientEntity> existing = ingredientRepository.findById(id);
        if (existing.isPresent()) {
            IngredientEntity ingredient = existing.get();
            ingredient.setName(updatedIngredient.getName());
            ingredient.setQuantity(updatedIngredient.getQuantity());
            ingredient.setRecipeId(updatedIngredient.getRecipeId());
            return ingredientRepository.save(ingredient);
        } else {
            return null;
        }
    }

    // DELETE
    public void deleteIngredient(int id) {
        ingredientRepository.deleteById(id);
    }
}