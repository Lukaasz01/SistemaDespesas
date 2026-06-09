package com.lucas.demo.repository;

import com.lucas.demo.model.CategoriaModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoriaRepository extends JpaRepository<CategoriaModel, Long> {
    List<CategoriaModel> findByUsuarioId(Long usuarioId);

}
