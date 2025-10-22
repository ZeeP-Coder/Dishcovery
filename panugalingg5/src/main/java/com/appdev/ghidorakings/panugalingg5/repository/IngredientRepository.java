package com.appdev.ghidorakings.panugalingg5.repository;

import com.appdev.ghidorakings.panugalingg5.entity.IngredientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredientRepository extends JpaRepository<IngredientEntity, Integer> {
}
