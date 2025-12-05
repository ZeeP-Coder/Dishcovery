package com.appdevg5.ghidorakings.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.appdevg5.ghidorakings.entity.RatingEntity;
import com.appdevg5.ghidorakings.service.RatingService;

@RestController
@RequestMapping("/rating")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class RatingController {

    @Autowired
    RatingService ratingService;

    @PostMapping("/insertRating")
    public RatingEntity insertRating(@RequestBody RatingEntity ratingEntity) {
        return ratingService.createRating(ratingEntity);
    }

    @GetMapping("/getAllRatings")
    public List<RatingEntity> getAllRatings() {
        return ratingService.getAllRatings();
    }

    @PutMapping("/updateRating")
    public RatingEntity updateRating(@RequestParam int ratingId, @RequestBody RatingEntity newRatingDetails) {
        return ratingService.updateRating(ratingId, newRatingDetails);
    }

    @DeleteMapping("/deleteRating/{ratingId}")
    public String deleteRating(@PathVariable int ratingId) {
        return ratingService.deleteRating(ratingId);
    }
}
