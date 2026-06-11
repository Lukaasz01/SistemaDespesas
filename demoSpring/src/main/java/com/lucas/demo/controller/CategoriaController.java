package com.lucas.demo.controller;

import com.lucas.demo.dto.CategoriaResponseDTO;
import com.lucas.demo.model.CategoriaModel;
import com.lucas.demo.repository.CategoriaRepository;
import com.lucas.demo.service.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaRepository repository;

    @Autowired
    private CategoriaService service;

    @GetMapping
    public List<CategoriaResponseDTO> listarCategorias() {
        return service.listarCategoriasDoUsuarioLogado();
    }

    @PostMapping
    public CategoriaResponseDTO saveCategoria(@Valid @RequestBody CategoriaModel categoria) {
        return service.salvar(categoria);
    }

    @GetMapping("/{id}")
    public CategoriaResponseDTO buscarCategoria(@PathVariable Long id) {
        return service.buscarPorIdDoUsuarioLogado(id);
    }

    @PutMapping("/{id}")
    public CategoriaResponseDTO atualizarCategoria(@PathVariable Long id, @Valid @RequestBody CategoriaModel categoria) {
        return service.atualizar(id, categoria);
    }

    @DeleteMapping("/{id}")
    public void deletCategoria(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
