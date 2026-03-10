package com.lucas.demo.repository;

import com.lucas.demo.model.DespesaModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DespesaRepository extends JpaRepository<DespesaModel, Long> {
    
}