
package com.example.Usermicroservice.controller;

import com.example.Usermicroservice.jwt.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/auth")
public class TokenValidationController {

    private final JwtService jwtService;

    public TokenValidationController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validate(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", 401, "error", "Unauthorized", "message", "Missing Bearer token"));
        }

        String token = authHeader.substring(7);
        try {
            Claims claims = jwtService.parseClaims(token);
            // You can expose only safe fields
            return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "subject", claims.getSubject(),
                    "expiresAt", claims.getExpiration(),
                    "issuedAt", claims.getIssuedAt(),
                    "role", claims.get("role", String.class),
                    "claims", claims // remove if you don't want all claims
            ));
        } catch (JwtException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("valid", false, "error", "Invalid token", "message", ex.getMessage()));
        }
    }
}
