package com.lucas.demo.controller;

import com.lucas.demo.repository.LoginRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.lucas.demo.model.LoginModel;
import com.lucas.demo.service.LoginService;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private LoginRepository repository;

    @Autowired
    private LoginService service;

    @PostMapping
    public LoginModel saveUser(@RequestBody LoginModel User ) {
        return repository.save(User);
    }

    @DeleteMapping
    public void deletUser(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @PostMapping("/entrar")
    public String fazerLogin(@RequestBody @NonNull LoginModel dadosLogin) {

        return service.executarLogin(dadosLogin.getEmail(), dadosLogin.getPassword());
    }

}