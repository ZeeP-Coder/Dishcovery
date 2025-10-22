package com.appdev.ghidorakings.libetariog5.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.appdev.ghidorakings.libetariog5.entity.RecipeEntity;
import com.appdev.ghidorakings.libetariog5.repository.RecipeRepository;


@Service

public class RecipeService {
    @Autowired
    RecipeRepository recipeRepository;

    public RecipeEntity createRecipe(RecipeEntity recipe) {
        return recipeRepository.save(recipe);
    }

    public List<RecipeEntity> getAllRecipes() {
        return recipeRepository.findAll();
    }

    public RecipeEntity updateRecipe(int recipeId, RecipeEntity newRecipeDetails){
        RecipeEntity recipe = new RecipeEntity();
        try{
            recipe = recipeRepository.findById(recipeId).orElseThrow(() -> new NoSuchElementException("Recipe with ID " + recipeId + " not found."));
            recipe.setTitle(newRecipeDetails.getTitle());
            recipe.setDescription(newRecipeDetails.getDescription());
            recipe.setSteps(newRecipeDetails.getSteps());
            return recipeRepository.save(recipe);
            
        } catch (NoSuchElementException e) {
            throw e;
        } 
    }

    public String deleteRecipe(int recipeId) {
        String msg = "";
        if (recipeRepository.findById(recipeId).isPresent()) {
            recipeRepository.deleteById(recipeId);
            msg = "Recipe with ID " + recipeId + " has been deleted.";
        } else {
            msg = "Recipe with ID " + recipeId + " not found.";
        }
    return msg;
    }

}