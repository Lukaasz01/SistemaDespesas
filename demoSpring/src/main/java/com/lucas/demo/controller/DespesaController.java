package com.lucas.demo.controller;

import com.lucas.demo.model.DespesaModel;
import com.lucas.demo.repository.DespesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/despesas")
public class DespesaController {

    @Autowired
    private DespesaRepository repository;

    @GetMapping
    public List<DespesaModel> listarTodas() {
        return repository.findAll();
    }

    @PostMapping
    public DespesaModel salvar(@RequestBody DespesaModel novaDespesa) {
        return repository.save(novaDespesa);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }

}