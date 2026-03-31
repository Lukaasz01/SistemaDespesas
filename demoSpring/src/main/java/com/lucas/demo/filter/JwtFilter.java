package com.lucas.demo.filter;

import com.lucas.demo.repository.LoginRepository;
import com.lucas.demo.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private LoginRepository loginRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7); // remove "Bearer "
            String userId = tokenService.validarToken(token); // pega o ID

            if (userId != null) {
                // busca o usuário no banco pelo ID do token
                var usuario = loginRepository.findById(Long.parseLong(userId));

                if (usuario.isPresent()) {
                    // diz ao Spring Security: "esse usuário está autenticado"
                    var auth = new UsernamePasswordAuthenticationToken(
                            usuario.get(), null, List.of()
                    );
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        }

        chain.doFilter(request, response); // continua o fluxo normal
    }
}