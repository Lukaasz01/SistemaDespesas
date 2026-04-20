package com.lucas.demo.service;

import com.lucas.demo.exception.RequestErrorException;
import com.lucas.demo.model.LoginModel;
import com.lucas.demo.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.lucas.demo.dto.TokenResponseDTO;

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

    public void deletarUsuario(LoginModel user){
        long idUsuario = user.getId();
        repository.deleteById(idUsuario);
    }

    public TokenResponseDTO executarLogin(String email, String password) {
        LoginModel userFound = repository.findByEmail(email);

        if (userFound == null || !passwordEncoder.matches(password, userFound.getPassword())) {
            throw new RequestErrorException("E-mail ou senha incorretos!");
        }

        String tokenGerado = tokenService.gerarToken(userFound);

        return new TokenResponseDTO(
                tokenGerado,
                userFound.getId(),
                userFound.getEmail(),
                userFound.getNome()
        );
    }



}