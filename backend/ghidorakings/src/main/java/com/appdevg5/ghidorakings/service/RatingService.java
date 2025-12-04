package com.appdevg5.ghidorakings.dishcovery.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdevg5.ghidorakings.dishcovery.entity.RatingEntity;
import com.appdevg5.ghidorakings.dishcovery.repository.RatingRepository;

@Service
public class RatingService {

    @Autowired
    RatingRepository ratingRepository;

    public RatingEntity createRating(RatingEntity rating) {
        // clear id so a new rating is always created
        rating.setRatingId(null);
        return ratingRepository.save(rating);
    }

    public List<RatingEntity> getAllRatings() {
        return ratingRepository.findAll();
    }

    public RatingEntity updateRating(int ratingId, RatingEntity newRatingDetails) {
        try {
            RatingEntity rating = ratingRepository.findById(ratingId).orElseThrow(() -> new NoSuchElementException("Rating with ID " + ratingId + " not found."));
            rating.setScore(newRatingDetails.getScore());
            return ratingRepository.save(rating);
        } catch (NoSuchElementException e) {
            throw e;
        }
    }

    public String deleteRating(int ratingId) {
        if (ratingRepository.findById(ratingId).isPresent()) {
            ratingRepository.deleteById(ratingId);
            return "Rating with ID " + ratingId + " has been deleted.";
        } else {
            return "Rating with ID " + ratingId + " not found.";
        }
    }
}
