package com.lucas.demo.service;

import com.lucas.demo.model.DespesaModel;
import com.lucas.demo.repository.DespesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoriaService {
    @Autowired
    private DespesaRepository repository;

}
