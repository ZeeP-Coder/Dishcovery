package com.appdevg5.ghidorakings.dishcovery.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.appdevg5.ghidorakings.dishcovery.entity.RecipeEntity;
import com.appdevg5.ghidorakings.dishcovery.service.RecipeService;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/recipe")
@CrossOrigin(origins = "http://localhost:3000")
public class RecipeController {
    @Autowired
    RecipeService recipeService;

    @GetMapping("/print")
    public String getMethodName(@RequestParam String param) {
        return new String();
    }
    
    @PostMapping("/insertRecipe")
    public RecipeEntity insertRecipe(@RequestBody RecipeEntity recipeEntity) {
        return recipeService.createRecipe(recipeEntity);
    }

    @GetMapping("/getAllRecipes")
    public List<RecipeEntity> getAllRecipes() {
        return recipeService.getAllRecipes();
    }

    @PutMapping("/updateRecipe/{recipeId}")
    public ResponseEntity<RecipeEntity> updateRecipe(@PathVariable Integer recipeId, @RequestBody RecipeEntity newRecipeDetails) {
        RecipeEntity updated = recipeService.updateRecipe(recipeId, newRecipeDetails);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/deleteRecipe/{recipeId}")
    public ResponseEntity<String> deleteRecipe(@PathVariable Integer recipeId) {
        String result = recipeService.deleteRecipe(recipeId);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }
    
    
}