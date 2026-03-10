package com.lucas.demo.model;

import jakarta.persistence.Entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Entity
public class DespesaModel {

    private Long id;
    private String categoria;
    private String descricao;
    private BigDecimal valor;
    private LocalDate data;

    public Long getId() {
        return id;
    }

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
}
