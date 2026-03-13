package com.lucas.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class RequestErrorException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    /**
     * @param message
     */
    public RequestErrorException(String message) {
        super(message);
    }

    /**
     * @param message
     * @param cause
     */
    public RequestErrorException(String message, Throwable cause) {
        super(message, cause);
    }
}
