package com.appdevg5.ghidorakings.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdevg5.ghidorakings.entity.IngredientEntity;

@Repository
public interface IngredientRepository extends JpaRepository<IngredientEntity, Integer> {
	List<IngredientEntity> findByRecipeId(Integer recipeId);
	void deleteByRecipeId(Integer recipeId);
}