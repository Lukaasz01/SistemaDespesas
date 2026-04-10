package com.lucas.demo.service;

import com.lucas.demo.model.CategoriaModel;
import com.lucas.demo.model.LoginModel;
import com.lucas.demo.repository.CategoriaRepository;
import com.lucas.demo.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CategoriaService {
    @Autowired
    private CategoriaRepository repository;

    @Autowired
    private LoginRepository loginRepository;

   public CategoriaModel salvar(CategoriaModel categoria) {
       // pegamos a autenticação do JWT Filter
       var auth = SecurityContextHolder.getContext().getAuthentication();

       // No filter tem o objeto 'usuario.get()', o principal é o LoginModel
       LoginModel usuarioLogado = (LoginModel) auth.getPrincipal();

       // agora é só linkar e salvar
       categoria.setUsuario(usuarioLogado);
       return repository.save(categoria);
   }

}
