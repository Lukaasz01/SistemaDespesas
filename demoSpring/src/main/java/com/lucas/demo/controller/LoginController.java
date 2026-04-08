package com.lucas.demo.controller;

import com.lucas.demo.repository.LoginRepository;
import org.apache.coyote.Response;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lucas.demo.model.LoginModel;
import com.lucas.demo.service.LoginService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private LoginRepository repository;

    @Autowired
    private LoginService service;

    @PostMapping
    public LoginModel saveUser(@RequestBody LoginModel user){
        return service.salvarUsuario(user);
    }

    @DeleteMapping
    public void deletUser(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @GetMapping
    public ResponseEntity<String> fazerLogin(@RequestParam("email") String email, @RequestParam("password") String password) {
        var result = service.executarLogin(email, password);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/auth")
    public ResponseEntity<String> fazerLogin(@RequestBody LoginModel loginData) {
        var token = service.executarLogin(loginData.getEmail(), loginData.getPassword());
        return ResponseEntity.ok(token);
    }

}