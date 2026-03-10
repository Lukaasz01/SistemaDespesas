package com.lucas.demo.model;

@Entity
public class Categoria {
    private String Categoria;
    private String Descricao;

    public String getCategoria() {
        return Categoria;
    }

    public void setCategoria(String categoria) {
        Categoria = categoria;
    }

    public String getDescricao() {
        return Descricao;
    }

    public void setDescricao(String descricao) {
        Descricao = descricao;
    
}