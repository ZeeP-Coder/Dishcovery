package com.appdevg5.ghidorakings.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdevg5.ghidorakings.entity.RatingEntity;

@Repository
public interface RatingRepository extends JpaRepository<RatingEntity, Integer> {

}
