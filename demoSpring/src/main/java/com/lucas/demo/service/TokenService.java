package com.lucas.demo.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.lucas.demo.model.LoginModel;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenService {
    @Value("${api.security.token.secret}")
    private String secret;
    private final Set<String> tokensRevogados = ConcurrentHashMap.newKeySet();

    public String gerarToken(LoginModel usuario) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withIssuer("rastreador-despesas-api")
                    .withSubject(usuario.getId().toString())
                    .withExpiresAt(gerarDataExpiracao())
                    .sign(algoritmo);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar o token JWT", exception);
        }
    }

    public String validarToken(String token) {
        try {
            if (tokensRevogados.contains(token)) {
                return null;
            }

            Algorithm algoritmo = Algorithm.HMAC256(secret);
            return JWT.require(algoritmo)
                    .withIssuer("rastreador-despesas-api")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    public void revogarToken(String token) {
        if (token != null && !token.isBlank()) {
            tokensRevogados.add(token);
        }
    }

    private Instant gerarDataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
