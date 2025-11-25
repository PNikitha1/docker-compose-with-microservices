package com.example.Usermicroservice.config;


//com.example.Usermicroservice.openapi.OpenApiSecurityConfig
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@SecurityScheme(
 name = "bearerAuth",
 type = io.swagger.v3.oas.annotations.enums.SecuritySchemeType.HTTP,
 scheme = "bearer",
 bearerFormat = "JWT"
)
public class OpenApiSecurityConfig { }

