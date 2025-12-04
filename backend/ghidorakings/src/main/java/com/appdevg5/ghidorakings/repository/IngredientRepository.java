package com.appdevg5.ghidorakings.dishcovery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdevg5.ghidorakings.dishcovery.entity.IngredientEntity;

@Repository
public interface IngredientRepository extends JpaRepository<IngredientEntity, Integer> {
}