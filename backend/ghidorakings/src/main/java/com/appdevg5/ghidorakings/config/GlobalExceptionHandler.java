package com.appdevg5.ghidorakings.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler to prevent information leakage
 * and provide consistent error responses.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle IllegalArgumentException (e.g., duplicate email, invalid input)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    /**
     * Handle generic exceptions - DO NOT expose stack traces or internal details
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception ex, WebRequest request) {
        // Log the actual error internally (but don't expose to client)
        System.err.println("Internal error: " + ex.getClass().getName());
        ex.printStackTrace(); // Only visible in server logs
        
        // Return generic error message to client
        Map<String, String> error = new HashMap<>();
        error.put("error", "An error occurred processing your request");
        error.put("status", "500");
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
    
    /**
     * Handle NullPointerException
     */
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<?> handleNullPointerException(NullPointerException ex, WebRequest request) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Invalid request data");
        error.put("status", "400");
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
