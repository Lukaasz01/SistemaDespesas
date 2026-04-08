package com.lucas.demo.dto;

public class TokenResponseDTO {
    private String token;
    private Long id;
    private String email;
    private String nome;

    public TokenResponseDTO(String token, Long id, String email, String nome){
        this.token = token;
        this.id = id;
        this.email = email;
        this.nome = nome;
    }

    public String getToken(){return token;}
    public Long getId(){return id;}
    public String getEmail(){return email;}
    public String getNome(){return nome;}
}
