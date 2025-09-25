// src/main/java/com/example/project/exception/DuplicateUsernameException.java
package com.example.project.exception;

public class DuplicateNicknameException extends RuntimeException {
    public DuplicateNicknameException(String message) {
        super(message);
    }
}