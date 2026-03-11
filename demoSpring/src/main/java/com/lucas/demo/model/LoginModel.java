package com.lucas.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class LoginModel {
    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "nome_usuario")
    private String user;

    @Column(unique = true)
    private String email;
    private String password;

    public Long getId() {
        return id;
    }

    public String getUser() {
        return user;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}