package com.lucas.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
public class CategoriaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome da categoria e obrigatorio.")
    private String categoria;
    private String descricao;

    @PositiveOrZero(message = "O valor da categoria nao pode ser negativo.")
    private Long valor;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private LoginModel usuario;

    // GETTERS E SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Long getValor() { return valor; }
    public void setValor(Long valor) { this.valor = valor; }

    public LoginModel getUsuario() { return usuario; }
    public void setUsuario(LoginModel usuario) { this.usuario = usuario; }
}
