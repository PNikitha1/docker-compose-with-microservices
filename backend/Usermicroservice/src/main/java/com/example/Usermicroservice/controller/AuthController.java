package com.example.Usermicroservice.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.Usermicroservice.dto.AuthResponse;
import com.example.Usermicroservice.dto.LoginRequest;
import com.example.Usermicroservice.dto.RegisterRequest;
import com.example.Usermicroservice.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private AuthService service;
    
    @Autowired
    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        AuthResponse res = service.register(req);
        return ResponseEntity.ok(res); // or 201 Created if you prefer
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(service.login(req));
    }
}
