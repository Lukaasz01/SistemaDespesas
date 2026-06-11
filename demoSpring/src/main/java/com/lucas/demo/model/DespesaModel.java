package com.lucas.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
public class DespesaModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome da despesa e obrigatorio.")
    @Size(min = 3, max = 80, message = "O nome da despesa deve ter entre 3 e 80 caracteres.")
    private String nome;

    @NotBlank(message = "A categoria da despesa e obrigatoria.")
    @Size(min = 3, max = 60, message = "A categoria da despesa deve ter entre 3 e 60 caracteres.")
    private String categoria;

    @NotBlank(message = "A descricao da despesa e obrigatoria.")
    @Size(min = 3, max = 120, message = "A descricao da despesa deve ter entre 3 e 120 caracteres.")
    private String descricao;

    @NotNull(message = "O valor da despesa e obrigatorio.")
    @PositiveOrZero(message = "O valor da despesa nao pode ser negativo.")
    @Digits(integer = 12, fraction = 2, message = "O valor da despesa deve ter no maximo 2 casas decimais.")
    @Column(precision = 14, scale = 2, nullable = false)
    private BigDecimal valor;

    @NotNull(message = "A data da despesa e obrigatoria.")
    @Column(nullable = false)
    private LocalDate data;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private LoginModel usuario;

    public String getNome(){ return nome; }

    public Long getId() {
        return id;
    }

    public void setNome(String nome){ this.nome = nome; }
    public void setId(Long id) {
        this.id = id;
    }

    public String getCategoria() {
        return categoria;
    }
    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getDescricao() {
        return descricao;
    }
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValor() {
        return valor;
    }
    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public LocalDate getData() {
        return data;
    }
    public void setData(LocalDate data) {
        this.data = data;
    }

    public LoginModel getUsuario() {
        return usuario;
    }

    public void setUsuario(LoginModel usuario) {
        this.usuario = usuario;
    }
}
