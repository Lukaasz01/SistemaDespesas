package com.lucas.demo.dto;

import com.lucas.demo.model.CategoriaModel;

import java.math.BigDecimal;

public class CategoriaResponseDTO {
    private final Long id;
    private final String categoria;
    private final String descricao;
    private final BigDecimal valor;

    public CategoriaResponseDTO(CategoriaModel categoria) {
        this.id = categoria.getId();
        this.categoria = categoria.getCategoria();
        this.descricao = categoria.getDescricao();
        this.valor = categoria.getValor();
    }

    public Long getId() {
        return id;
    }

    public String getCategoria() {
        return categoria;
    }

    public String getDescricao() {
        return descricao;
    }

    public BigDecimal getValor() {
        return valor;
    }
}
