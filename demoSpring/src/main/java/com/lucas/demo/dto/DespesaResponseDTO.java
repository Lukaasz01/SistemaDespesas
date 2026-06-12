package com.lucas.demo.dto;

import com.lucas.demo.model.DespesaModel;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DespesaResponseDTO {
    private final Long id;
    private final String nome;
    private final String categoria;
    private final String descricao;
    private final BigDecimal valor;
    private final LocalDate data;

    public DespesaResponseDTO(DespesaModel despesa) {
        this.id = despesa.getId();
        this.nome = despesa.getNome();
        this.categoria = despesa.getCategoria();
        this.descricao = despesa.getDescricao();
        this.valor = despesa.getValor();
        this.data = despesa.getData();
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
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

    public LocalDate getData() {
        return data;
    }
}
