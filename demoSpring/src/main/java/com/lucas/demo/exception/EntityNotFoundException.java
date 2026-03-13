package com.lucas.demo.exception;

public class EntityNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    /**
     * @param message
     */
    public EntityNotFoundException(String message) {
        super(message);
    }

    /**
     * @param message
     * @param cause
     */
    public EntityNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

}
