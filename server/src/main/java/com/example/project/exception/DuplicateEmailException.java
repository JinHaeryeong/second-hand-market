// src/main/java/com/example/project/exception/DuplicateUsernameException.java
package com.example.project.exception;

public class DuplicateEmailException extends RuntimeException {
    public DuplicateEmailException(String message) {
        super(message);
    }
}