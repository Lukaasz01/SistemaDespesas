package com.lucas.demo.repository;

import com.lucas.demo.model.LoginModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginRepository extends JpaRepository<LoginModel, Long> {
    LoginModel findByEmail(String email);
}