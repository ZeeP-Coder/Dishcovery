package com.appdevg5.ghidorakings.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.appdevg5.ghidorakings.entity.FavoriteEntity;
import com.appdevg5.ghidorakings.service.FavoriteService;

@RestController
@RequestMapping("/favorite")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class FavoriteController {

    @Autowired
    FavoriteService favoriteService;

    @PostMapping("/insertFavorite")
    public FavoriteEntity insertFavorite(@RequestBody FavoriteEntity favoriteEntity) {
        return favoriteService.createFavorite(favoriteEntity);
    }

    @GetMapping("/getAllFavorites")
    public List<FavoriteEntity> getAllFavorites() {
        return favoriteService.getAllFavorites();
    }

    @PutMapping("/updateFavorite")
    public FavoriteEntity updateFavorite(@RequestParam int favoriteId, @RequestBody FavoriteEntity newFavoriteDetails) {
        return favoriteService.updateFavorite(favoriteId, newFavoriteDetails);
    }

    @DeleteMapping("/deleteFavorite/{favoriteId}")
    public String deleteFavorite(@PathVariable int favoriteId) {
        return favoriteService.deleteFavorite(favoriteId);
    }
}
