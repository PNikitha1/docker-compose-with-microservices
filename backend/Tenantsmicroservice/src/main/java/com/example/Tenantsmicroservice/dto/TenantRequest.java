package com.example.Tenantsmicroservice.dto;


import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class TenantRequest {

    @NotBlank @Size(max = 16)
    private String tenantId; // if you prefer server-generated, make this optional

    @NotBlank @Size(max = 100)
    private String name;

    @NotBlank @Size(max = 20)
    private String phone;

    @NotBlank @Size(max = 20)
    private String room;

    @NotNull
    private LocalDate checkIn;

    @Min(0)
    private Integer due;

    // getters/setters
    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }
    public LocalDate getCheckIn() { return checkIn; }
    public void setCheckIn(LocalDate checkIn) { this.checkIn = checkIn; }
    public Integer getDue() { return due; }
    public void setDue(Integer due) { this.due = due; }
}

