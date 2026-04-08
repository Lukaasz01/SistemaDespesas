package com.lucas.demo.service;

import com.lucas.demo.exception.RequestErrorException;
import com.lucas.demo.model.LoginModel;
import com.lucas.demo.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private LoginRepository repository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public LoginModel salvarUsuario(LoginModel user){
        String senhaCodificada = passwordEncoder.encode(user.getPassword());

        user.setPassword(senhaCodificada);
        return repository.save(user);
    }

    public String executarLogin(String email, String password) {
        LoginModel userFound = repository.findByEmail(email);

        if (userFound == null || !passwordEncoder.matches(password, userFound.getPassword())) {
            throw new RequestErrorException("E-mail ou senha incoretos!");
        }

        return tokenService.gerarToken(userFound);
    }
}