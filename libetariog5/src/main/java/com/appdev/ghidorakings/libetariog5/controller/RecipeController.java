package com.appdev.ghidorakings.libetariog5.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.appdev.ghidorakings.libetariog5.entity.RecipeEntity;
import com.appdev.ghidorakings.libetariog5.service.RecipeService;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/recipe")
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

    @PutMapping("/updateRecipe")
    public RecipeEntity updateRecipe(@RequestParam int recipeId, @RequestBody RecipeEntity newRecipeDetails) {
        return recipeService.updateRecipe(recipeId, newRecipeDetails);
    }

    @DeleteMapping("/deleteRecipe/{recipeId}")
    public String deleteRecipe(@PathVariable int recipeId) {
        return recipeService.deleteRecipe(recipeId);
    }
    
    
}
