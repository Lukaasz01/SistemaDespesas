package com.lucas.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RequestErrorException.class)
    public ResponseEntity<Map<String, String>> loginHandleRequestError(RequestErrorException ex) {

        Map<String, String> resposta = new HashMap<>();
        resposta.put("erro", ex.getMessage());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resposta);
    }
}
