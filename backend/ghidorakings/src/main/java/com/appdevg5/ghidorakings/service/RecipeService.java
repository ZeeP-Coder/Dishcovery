package com.appdevg5.ghidorakings.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdevg5.ghidorakings.entity.RecipeEntity;
import com.appdevg5.ghidorakings.repository.RecipeRepository;


@Service

public class RecipeService {
    @Autowired
    RecipeRepository recipeRepository;

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
        return recipeRepository.save(recipe);
    }

    public List<RecipeEntity> getAllRecipes() {
        return recipeRepository.findAll();
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
            // copy ingredients if provided (may be JSON string)
            if (newRecipeDetails.getIngredients() != null) {
                recipe.setIngredients(newRecipeDetails.getIngredients());
            }
            if (newRecipeDetails.getCategory() != null) {
                recipe.setCategory(newRecipeDetails.getCategory());
            }
            if (newRecipeDetails.getImage() != null) {
                recipe.setImage(newRecipeDetails.getImage());
            }
            if (newRecipeDetails.getUserId() != null) {
                recipe.setUserId(newRecipeDetails.getUserId());
            }
            return recipeRepository.save(recipe);
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
        return recipeRepository.findByIsApproved(false);
    }

    // Get all approved recipes
    public List<RecipeEntity> getApprovedRecipes() {
        return recipeRepository.findByIsApproved(true);
    }

    // Approve a recipe
    public RecipeEntity approveRecipe(int recipeId) {
        try {
            RecipeEntity recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new NoSuchElementException("Recipe with ID " + recipeId + " not found."));
            recipe.setApproved(true);
            return recipeRepository.save(recipe);
        } catch (NoSuchElementException e) {
            return null;
        }
    }

    // Get all recipes by user ID (for "My Recipes" page)
    public List<RecipeEntity> getRecipesByUserId(Integer userId) {
        return recipeRepository.findByUserId(userId);
    }

}