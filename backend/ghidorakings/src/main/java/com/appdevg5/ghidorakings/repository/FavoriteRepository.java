package com.appdevg5.ghidorakings.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdevg5.ghidorakings.entity.FavoriteEntity;

@Repository
public interface FavoriteRepository extends JpaRepository<FavoriteEntity, Integer> {
    List<FavoriteEntity> findByUserId(Integer userId);
}
