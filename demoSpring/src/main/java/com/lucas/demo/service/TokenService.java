package com.lucas.demo.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.lucas.demo.model.LoginModel;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {
    private String secret = "minha-senha-secreta-muito-forte";

    public String gerarToken(LoginModel usuario) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withIssuer("rastreador-despesas-api") // Quem está emitindo o crachá
                    .withSubject(usuario.getId().toString()) // A informação principal que queremos guardar: O ID do usuário!
                    .withExpiresAt(gerarDataExpiracao()) // Data de validade do crachá
                    .sign(algoritmo); // Carimba e assina

        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar o token JWT", exception);
        }
    }

    // Função auxiliar que diz que o crachá vale por 2 horas a partir de agora
    private Instant gerarDataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
