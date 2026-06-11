package com.lucas.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

@Entity
public class CategoriaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome da categoria e obrigatorio.")
    @Size(min = 3, max = 60, message = "O nome da categoria deve ter entre 3 e 60 caracteres.")
    private String categoria;
    @NotBlank(message = "A descricao da categoria e obrigatoria.")
    @Size(min = 3, max = 120, message = "A descricao da categoria deve ter entre 3 e 120 caracteres.")
    private String descricao;

    @NotNull(message = "O valor da categoria e obrigatorio.")
    @PositiveOrZero(message = "O valor da categoria nao pode ser negativo.")
    @Digits(integer = 12, fraction = 2, message = "O valor da categoria deve ter no maximo 2 casas decimais.")
    @Column(precision = 14, scale = 2, nullable = false)
    private BigDecimal valor;

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

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public LoginModel getUsuario() { return usuario; }
    public void setUsuario(LoginModel usuario) { this.usuario = usuario; }
}
