package com.appdevg5.ghidorakings.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdevg5.ghidorakings.entity.RecipeEntity;
import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<RecipeEntity, Integer> {
    List<RecipeEntity> findByIsApproved(boolean isApproved);
    List<RecipeEntity> findByUserId(Integer userId);
}