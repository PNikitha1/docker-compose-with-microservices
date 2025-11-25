
package com.example.Usermicroservice.service;

import com.example.Usermicroservice.dto.AuthResponse;
import com.example.Usermicroservice.dto.LoginRequest;
import com.example.Usermicroservice.dto.RegisterRequest;
import com.example.Usermicroservice.jwt.JwtService;
import com.example.Usermicroservice.model.User;
import com.example.Usermicroservice.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwtService) {
        this.users = users;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    /** Registers a new user, returns JWT + profile in AuthResponse */
    public AuthResponse register(RegisterRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        String phone = req.getPhone().trim();

        if (users.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }
        if (users.existsByPhone(phone)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Phone already registered");
        }

        User u = new User();
        u.setName(req.getName().trim());
        u.setEmail(email);
        u.setPhone(phone);
        u.setPasswordHash(encoder.encode(req.getPassword()));
        // Default role; change as needed (e.g., "USER", "ADMIN", "OWNER")
        u.setRole("OWNER");

        u = users.save(u);

        String token = jwtService.issueToken(
            u.getEmail(),
            Map.of("role", u.getRole())
        );

        return new AuthResponse(token, u.getName(), u.getEmail(), u.getPhone(), u.getRole());
    }

    /** Authenticates an existing user, returns JWT + profile in AuthResponse */
    public AuthResponse login(LoginRequest req) {
        User u = users.findByEmail(req.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!encoder.matches(req.getPassword(), u.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String token = jwtService.issueToken(
            u.getEmail(),
            Map.of("role", u.getRole())
        );

        return new AuthResponse(token, u.getName(), u.getEmail(), u.getPhone(), u.getRole());
    }
}
