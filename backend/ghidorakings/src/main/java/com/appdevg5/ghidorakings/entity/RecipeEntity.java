package com.appdevg5.ghidorakings.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "recipe")

public class RecipeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipe_id")
    private Integer recipeId;

    @Column(name = "title")
    private String title;

    @Column(name = "description", length = 5000, columnDefinition = "VARCHAR(5000)")
    private String description;

    @Column(name = "steps", length = 5000, columnDefinition = "VARCHAR(5000)")
    private String steps;

    @Column(name = "user_id")
    private Integer userId;

    // store ingredients as JSON text
    @Column(name = "ingredients", columnDefinition = "TEXT")
    private String ingredients;

    public RecipeEntity() {
        super();
    }

    public Integer getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(Integer recipeId) {
        this.recipeId = recipeId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSteps() {
        return steps;
    }

    public void setSteps(String steps) {
        this.steps = steps;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getIngredients() {
        return ingredients;
    }

    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }
}