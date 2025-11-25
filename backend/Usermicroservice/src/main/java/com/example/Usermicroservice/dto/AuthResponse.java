package com.example.Usermicroservice.dto;

public class AuthResponse {

    private String token;
    private String name;
    private String email;
    private String phone;
    private String role;

    public AuthResponse(String token, String name, String email, String phone, String role) {
        this.token = token;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
    }

    // getters
    public String getToken() { return token; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getRole() { return role; }
}

