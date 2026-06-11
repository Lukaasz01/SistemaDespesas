package com.lucas.demo.repository;

import com.lucas.demo.model.DespesaModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DespesaRepository extends JpaRepository<DespesaModel, Long> {
    List<DespesaModel> findByUsuarioId(Long usuarioId);
}
