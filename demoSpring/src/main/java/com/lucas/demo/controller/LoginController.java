package com.lucas.demo.controller;


import com.lucas.demo.dto.UsuarioResponseDTO;
import com.lucas.demo.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lucas.demo.model.LoginModel;
import com.lucas.demo.service.LoginService;
import com.lucas.demo.dto.TokenResponseDTO;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private LoginRepository repository;

    @Autowired
    private LoginService service;

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> saveUser(@RequestBody LoginModel user){ // ✅ Agora sim!
        LoginModel usuarioSalvo = service.salvarUsuario(user);
        return ResponseEntity.ok(new UsuarioResponseDTO(usuarioSalvo));
    }

    @DeleteMapping
    public void deletUser(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @PostMapping("/auth")
    public ResponseEntity<TokenResponseDTO> fazerLogin(@RequestBody LoginModel loginData) {
        TokenResponseDTO resposta = service.executarLogin(loginData.getEmail(), loginData.getPassword());
        return ResponseEntity.ok(resposta);
    }

}