package com.appdevg5.ghidorakings.repository;

import com.appdevg5.ghidorakings.entity.IngredientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredientRepository extends JpaRepository<IngredientEntity, Integer> {
}