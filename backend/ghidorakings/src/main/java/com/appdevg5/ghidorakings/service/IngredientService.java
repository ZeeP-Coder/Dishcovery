package com.appdevg5.ghidorakings.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdevg5.ghidorakings.entity.IngredientEntity;
import com.appdevg5.ghidorakings.repository.IngredientRepository;

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

    public List<IngredientEntity> findByRecipeId(Integer recipeId) {
        if (recipeId == null) {
            return Collections.emptyList();
        }
        return ingredientRepository.findByRecipeId(recipeId);
    }

    public List<IngredientEntity> replaceIngredientsForRecipe(Integer recipeId, List<IngredientEntity> ingredients) {
        if (recipeId == null) {
            return Collections.emptyList();
        }

        try {
            // Delete existing ingredients for this recipe
            ingredientRepository.deleteByRecipeId(recipeId);
        } catch (Exception e) {
            System.err.println("Error deleting ingredients for recipe " + recipeId + ": " + e.getMessage());
        }
        
        if (ingredients == null || ingredients.isEmpty()) {
            return Collections.emptyList();
        }

        List<IngredientEntity> toSave = new ArrayList<>();
        for (IngredientEntity ing : ingredients) {
            if (ing == null) continue;
            
            String name = ing.getName();
            if (name == null || name.trim().isEmpty()) {
                continue; // Skip ingredients without names
            }
            
            IngredientEntity copy = new IngredientEntity();
            copy.setIngredientId(null);
            copy.setName(name.trim());
            copy.setQuantity(ing.getQuantity() != null ? ing.getQuantity().trim() : "");
            copy.setRecipeId(recipeId);
            toSave.add(copy);
        }

        if (toSave.isEmpty()) {
            return Collections.emptyList();
        }

        return ingredientRepository.saveAll(toSave);
    }
}