package com.lucas.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/despesas")
public class DespesaController {

    @Autowired
    private DespesaRepository repository;

    @GetMapping
    public List<Despesa> listarTodas() {
        return repository.findAll();
    }

    @PostMapping
    public Despesa salvar(@RequestBody Despesa novaDespesa) {
        return repository.save(novaDespesa);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }

}