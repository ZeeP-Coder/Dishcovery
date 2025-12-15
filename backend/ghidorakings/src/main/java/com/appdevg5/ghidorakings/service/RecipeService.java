package com.appdevg5.ghidorakings.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdevg5.ghidorakings.entity.IngredientEntity;
import com.appdevg5.ghidorakings.entity.RecipeEntity;
import com.appdevg5.ghidorakings.repository.RecipeRepository;


@Service

public class RecipeService {
    @Autowired
    RecipeRepository recipeRepository;

    @Autowired
    IngredientService ingredientService;

    private void syncIngredients(RecipeEntity recipe, Integer recipeId) {
        if (recipe == null || recipeId == null) {
            return;
        }

        try {
            List<IngredientEntity> incoming = recipe.getIngredients();
            
            // If no ingredients provided and we have legacy JSON, don't sync
            if (incoming == null && recipe.getIngredientsJson() != null) {
                return;
            }
            
            // Only sync if we have ingredients to process
            if (incoming != null && !incoming.isEmpty()) {
                List<IngredientEntity> saved = ingredientService.replaceIngredientsForRecipe(recipeId, incoming);
                recipe.setIngredients(saved);
            } else if (incoming != null && incoming.isEmpty()) {
                // Empty list means clear all ingredients
                ingredientService.replaceIngredientsForRecipe(recipeId, new ArrayList<>());
                recipe.setIngredients(new ArrayList<>());
            }
        } catch (Exception e) {
            System.err.println("Error syncing ingredients for recipe " + recipeId + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void attachIngredients(RecipeEntity recipe) {
        if (recipe == null || recipe.getRecipeId() == null) {
            return;
        }
        List<IngredientEntity> ingredients = ingredientService.findByRecipeId(recipe.getRecipeId());
        recipe.setIngredients(ingredients);
    }

    public RecipeEntity createRecipe(RecipeEntity recipe) {
        // Validate required fields
        if (recipe.getTitle() == null || recipe.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Recipe title is required");
        }
        if (recipe.getUserId() == null || recipe.getUserId() <= 0) {
            throw new IllegalArgumentException("Valid user ID is required");
        }
        
        // Ensure ID is null so JPA creates a new record instead of updating an existing one
        recipe.setRecipeId(null);
        // New recipes must be approved by admin first
        recipe.setApproved(false);
        RecipeEntity saved = recipeRepository.save(recipe);
        syncIngredients(recipe, saved.getRecipeId());
        attachIngredients(saved);
        return saved;
    }

    public List<RecipeEntity> getAllRecipes() {
        List<RecipeEntity> recipes = recipeRepository.findAll();
        recipes.forEach(this::attachIngredients);
        return recipes;
    }
    
    // Get recipe by ID
    public RecipeEntity getRecipeById(int recipeId) {
        RecipeEntity recipe = recipeRepository.findById(recipeId).orElse(null);
        attachIngredients(recipe);
        return recipe;
    }

    public RecipeEntity updateRecipe(int recipeId, RecipeEntity newRecipeDetails){
        try{
            RecipeEntity recipe = recipeRepository.findById(recipeId).orElseThrow(() -> new NoSuchElementException("Recipe with ID " + recipeId + " not found."));
            // perform partial update: only set fields that are non-null in the request
            if (newRecipeDetails.getTitle() != null) {
                recipe.setTitle(newRecipeDetails.getTitle());
            }
            if (newRecipeDetails.getDescription() != null) {
                recipe.setDescription(newRecipeDetails.getDescription());
            }
            if (newRecipeDetails.getSteps() != null) {
                recipe.setSteps(newRecipeDetails.getSteps());
            }
            // replace ingredients if provided
            if (newRecipeDetails.getIngredients() != null) {
                syncIngredients(newRecipeDetails, recipeId);
            }
            if (newRecipeDetails.getCategory() != null) {
                recipe.setCategory(newRecipeDetails.getCategory());
            }
            if (newRecipeDetails.getDifficulty() != null) {
                recipe.setDifficulty(newRecipeDetails.getDifficulty());
            }
            if (newRecipeDetails.getCookTimeMinutes() != null) {
                recipe.setCookTimeMinutes(newRecipeDetails.getCookTimeMinutes());
            }
            if (newRecipeDetails.getEstimatedPrice() != null) {
                recipe.setEstimatedPrice(newRecipeDetails.getEstimatedPrice());
            }
            if (newRecipeDetails.getImage() != null) {
                recipe.setImage(newRecipeDetails.getImage());
            }
            if (newRecipeDetails.getUserId() != null) {
                recipe.setUserId(newRecipeDetails.getUserId());
            }
            RecipeEntity updated = recipeRepository.save(recipe);
            attachIngredients(updated);
            return updated;
        } catch (NoSuchElementException e) {
            throw e;
        }
    }

    public String deleteRecipe(int recipeId) {
        if (recipeRepository.findById(recipeId).isPresent()) {
            recipeRepository.deleteById(recipeId);
            return "Recipe with ID " + recipeId + " has been deleted.";
        } else {
            return "Recipe with ID " + recipeId + " not found.";
        }
    }

    // Get all pending recipes (not approved)
    public List<RecipeEntity> getPendingRecipes() {
        List<RecipeEntity> recipes = recipeRepository.findByIsApproved(false);
        recipes.forEach(this::attachIngredients);
        return recipes;
    }

    // Get all approved recipes
    public List<RecipeEntity> getApprovedRecipes() {
        List<RecipeEntity> recipes = recipeRepository.findByIsApproved(true);
        recipes.forEach(this::attachIngredients);
        return recipes;
    }

    // Approve a recipe
    public RecipeEntity approveRecipe(int recipeId) {
        try {
            RecipeEntity recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new NoSuchElementException("Recipe with ID " + recipeId + " not found."));
            recipe.setApproved(true);
            RecipeEntity saved = recipeRepository.save(recipe);
            attachIngredients(saved);
            return saved;
        } catch (NoSuchElementException e) {
            return null;
        }
    }

    // Get all recipes by user ID (for "My Recipes" page)
    public List<RecipeEntity> getRecipesByUserId(Integer userId) {
        if (userId == null) {
            return Collections.emptyList();
        }
        List<RecipeEntity> recipes = recipeRepository.findByUserId(userId);
        recipes.forEach(this::attachIngredients);
        return recipes;
    }

}