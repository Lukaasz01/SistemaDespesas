package com.lucas.demo.controller;

import com.lucas.demo.dto.DespesaResponseDTO;
import com.lucas.demo.model.DespesaModel;
import com.lucas.demo.service.DespesaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/despesas")
public class DespesaController {

    @Autowired
    private DespesaService service;

    @GetMapping
    public List<DespesaResponseDTO> listarTodas() {
        return service.listarDespesasDoUsuarioLogado();
    }

    @GetMapping("/{id}")
    public DespesaResponseDTO buscarDespesa(@PathVariable Long id) {
        return service.buscarPorIdDoUsuarioLogado(id);
    }

    @PostMapping
    public DespesaResponseDTO salvar(@Valid @RequestBody DespesaModel novaDespesa) {
        return service.salvar(novaDespesa);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletarPorIdDoUsuarioLogado(id);
    }
}
