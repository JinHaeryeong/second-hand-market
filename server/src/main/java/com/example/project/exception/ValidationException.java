// src/main/java/com/example/project/exception/ValidationException.java
package com.example.project.exception;

public class ValidationException extends RuntimeException {
    public ValidationException(String message) {
        super(message);
    }
}