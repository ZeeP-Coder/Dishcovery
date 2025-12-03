package com.appdevg5.ghidorakings.dishcovery.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdevg5.ghidorakings.dishcovery.entity.RecipeEntity;
import com.appdevg5.ghidorakings.dishcovery.repository.RecipeRepository;


@Service

public class RecipeService {
    @Autowired
    RecipeRepository recipeRepository;

    public RecipeEntity createRecipe(RecipeEntity recipe) {
        // Ensure ID is null so JPA creates a new record instead of updating an existing one
        recipe.setRecipeId(null);
        return recipeRepository.save(recipe);
    }

    public List<RecipeEntity> getAllRecipes() {
        return recipeRepository.findAll();
    }

    public RecipeEntity updateRecipe(int recipeId, RecipeEntity newRecipeDetails){
        try{
            RecipeEntity recipe = recipeRepository.findById(recipeId).orElseThrow(() -> new NoSuchElementException("Recipe with ID " + recipeId + " not found."));
            recipe.setTitle(newRecipeDetails.getTitle());
            recipe.setDescription(newRecipeDetails.getDescription());
            recipe.setSteps(newRecipeDetails.getSteps());
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

}