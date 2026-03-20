package com.lucas.demo.service;

import ch.qos.logback.core.net.SyslogOutputStream;
import com.lucas.demo.exception.GlobalExceptionHandler;
import com.lucas.demo.exception.RequestErrorException;
import com.lucas.demo.model.LoginModel;
import com.lucas.demo.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private LoginRepository repository;

    public String executarLogin(String email, String password) {
        LoginModel userFound = repository.findByEmail(email);

        if (userFound == null || !password.equals(userFound.getPassword().trim())) {
            throw new RequestErrorException("E-mail ou senha incorretos!");
        }

        System.out.println(tokenService);
        return tokenService.gerarToken(userFound);
    }

}