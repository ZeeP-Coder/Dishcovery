package com.appdev.ghidorakings.ding5.repository;

import com.appdev.ghidorakings.ding5.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {

}
