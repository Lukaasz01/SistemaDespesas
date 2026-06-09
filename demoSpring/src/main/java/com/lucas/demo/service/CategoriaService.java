package com.lucas.demo.service;

import com.lucas.demo.dto.CategoriaResponseDTO;
import com.lucas.demo.model.CategoriaModel;
import com.lucas.demo.model.LoginModel;
import com.lucas.demo.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {
    @Autowired
    private CategoriaRepository repository;

   public CategoriaResponseDTO salvar(CategoriaModel categoria) {
       // pegamos a autenticação do JWT Filter
       var auth = SecurityContextHolder.getContext().getAuthentication();

       // No filter tem o objeto 'usuario.get()', o principal é o LoginModel
       LoginModel usuarioLogado = (LoginModel) auth.getPrincipal();

       // agora é só linkar e salvar
       categoria.setUsuario(usuarioLogado);
       return new CategoriaResponseDTO(repository.save(categoria));
   }

   public List<CategoriaResponseDTO> listarCategoriasDoUsuarioLogado() {
       var auth = SecurityContextHolder.getContext().getAuthentication();
       LoginModel usuarioLogado = (LoginModel) auth.getPrincipal();
       return repository.findByUsuarioId(usuarioLogado.getId())
               .stream()
               .map(CategoriaResponseDTO::new)
               .toList();
   }

}
