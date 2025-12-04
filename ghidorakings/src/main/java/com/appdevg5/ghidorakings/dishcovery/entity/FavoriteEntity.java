package com.appdevg5.ghidorakings.dishcovery.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "favorite")
public class FavoriteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorite_id")
    private Integer favoriteId;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "recipe_id")
    private Integer recipeId;

    public FavoriteEntity() {}

    public Integer getFavoriteId() {
        return favoriteId;
    }

    public void setFavoriteId(Integer favoriteId) {
        this.favoriteId = favoriteId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(Integer recipeId) {
        this.recipeId = recipeId;
    }
}

