package com.appdevg5.ghidorakings.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdevg5.ghidorakings.entity.FavoriteEntity;
import com.appdevg5.ghidorakings.repository.FavoriteRepository;

@Service
public class FavoriteService {

    @Autowired
    FavoriteRepository favoriteRepository;

    public FavoriteEntity createFavorite(FavoriteEntity favorite) {
        // clear id so a new favorite is created instead of updating an existing one
        favorite.setFavoriteId(null);
        return favoriteRepository.save(favorite);
    }

    public List<FavoriteEntity> getAllFavorites() {
        return favoriteRepository.findAll();
    }

    public FavoriteEntity updateFavorite(int favoriteId, FavoriteEntity newFavoriteDetails) {
        try {
            FavoriteEntity fav = favoriteRepository.findById(favoriteId).orElseThrow(() -> new NoSuchElementException("Favorite with ID " + favoriteId + " not found."));
            // update ID fields if provided (non-null)
            if (newFavoriteDetails.getUserId() != null) fav.setUserId(newFavoriteDetails.getUserId());
            if (newFavoriteDetails.getRecipeId() != null) fav.setRecipeId(newFavoriteDetails.getRecipeId());
            return favoriteRepository.save(fav);
        } catch (NoSuchElementException e) {
            throw e;
        }
    }

    public String deleteFavorite(int favoriteId) {
        if (favoriteRepository.findById(favoriteId).isPresent()) {
            favoriteRepository.deleteById(favoriteId);
            return "Favorite with ID " + favoriteId + " has been deleted.";
        } else {
            return "Favorite with ID " + favoriteId + " not found.";
        }
    }
}
