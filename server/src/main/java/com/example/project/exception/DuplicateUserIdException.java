// src/main/java/com/example/project/exception/DuplicateUsernameException.java
package com.example.project.exception;

public class DuplicateUserIdException extends RuntimeException {
    public DuplicateUserIdException(String message) {
        super(message);
    }
}