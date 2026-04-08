package com.lucas.demo.dto;

import com.lucas.demo.model.LoginModel;

public class UsuarioResponseDTO {
    private Long id;
    private String email;

    public UsuarioResponseDTO(LoginModel model){
        this.id = model.getId();
        this.email = model.getEmail();
    }

    public Long getId(){ return id; }
    public String getEmail(){ return email; }
}
