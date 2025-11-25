package com.example.Usermicroservice.dto;


import jakarta.validation.constraints.*;

public class LoginRequest {

    @NotBlank @Email @Size(max = 200)
    private String email;

    @NotBlank @Size(min = 6, max = 100)
    private String password;

    // getters/setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

