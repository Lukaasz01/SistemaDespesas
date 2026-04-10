package com.lucas.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class LoginModel {
    @Id
    @GeneratedValue
    private Long id;

    private String nome;

    @Column(unique = true)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) // Permite ler a senha, mas nunca exibi-lá
    private String password;

    public Long getId() {return id;}

    public String getNome() { return nome; }

    public String getEmail() { return email; }

    public String getPassword() { return password; }

//    Setters
    public void setEmail(String email) { this.email = email; }

    public void setId(Long id) { this.id = id; }

    public void setPassword(String password) { this.password = password; }

    public void setNome(String nome) { this.nome = nome; }
}