package com.example.Usermicroservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Usermicroservice.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    Optional<User> findByEmail(String email);
}

