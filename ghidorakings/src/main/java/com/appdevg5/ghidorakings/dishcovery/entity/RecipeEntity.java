package com.appdevg5.ghidorakings.dishcovery.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tblRecipe")

public class RecipeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipe_Id")
    private int recipe_Id;

    @Column(name = "Title")
    private String title;

    @Column(name = "Description", length = 1000)
    private String description;

    @Column(name = "Steps", length = 2000)
    private String steps;

    @Column(name = "user_Id")
    private int user_Id;

    public RecipeEntity() {
        super();
    }

    public RecipeEntity(int recipe_Id, String title, String description, String steps, int user_Id) {
        super();
        this.recipe_Id = recipe_Id;
        this.title = title;
        this.description = description;
        this.steps = steps;
        this.user_Id = user_Id;
    }

    public int getRecipe_Id() {
        return recipe_Id;
    }

    public void setRecipe_Id(int recipe_Id) {
        this.recipe_Id = recipe_Id;
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

    public int getUser_Id() {
        return user_Id;
    }

    public void setUser_Id(int user_Id) {
        this.user_Id = user_Id;
    }
}