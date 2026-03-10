package com.lucas.demo.controller;

import com.lucas.demo.model.CategoriaModel;
import com.lucas.demo.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaRepository repository;

    @PostMapping
    public CategoriaModel saveCategoria(@RequestBody CategoriaModel categoria) {
        return repository.save(categoria);
    }

    @DeleteMapping("/{id}")
    public void deletCategoria(@PathVariable Long id) {
        repository.deleteById(id);
    }
}