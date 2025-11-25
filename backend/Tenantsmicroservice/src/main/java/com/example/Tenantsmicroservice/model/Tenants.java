package com.example.Tenantsmicroservice.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
public class Tenants {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // numeric PK for H2/Dev
    private Long id;

    /** Human-friendly ID, e.g. "T001" shown in UI */
    @NotBlank
    @Column(name = "tenant_id", nullable = false, unique = true, length = 16)
    private String tenantId;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Size(max = 20)
    @Column(nullable = false, length = 20)
    private String phone;

    @NotBlank
    @Size(max = 20)
    @Column(nullable = false, length = 20)
    private String room;

    @NotNull
    @Column(name = "check_in", nullable = false)
    private LocalDate checkIn;

    /** Amount due (INR) */
    @Min(0)
    @Column(nullable = false)
    private Integer due;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

