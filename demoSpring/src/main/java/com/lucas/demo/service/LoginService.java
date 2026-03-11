package com.lucas.demo.service;

import com.lucas.demo.model.LoginModel;
import com.lucas.demo.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    @Autowired
    private LoginRepository repository;

    public String executarLogin(String email, String password) {
        LoginModel userFound = repository.findByEmail(email);

        if (userFound == null){
            return "Usuário não cadastrado no Sistema!";
        } else if (password.equals(userFound.getPassword().trim())) {
            return "Usuário Logado com sucesso !";
        } else {
            return "Senha ou Usuário incorreto!";
        }
    }

}