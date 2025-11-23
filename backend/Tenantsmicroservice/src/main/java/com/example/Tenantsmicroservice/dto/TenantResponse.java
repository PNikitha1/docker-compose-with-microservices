package com.example.Tenantsmicroservice.dto;

import com.example.Tenantsmicroservice.model.Tenants;

public class TenantResponse {

    private Long id;
    private String tenantId;
    private String name;
    private String phone;
    private String room;
    private String checkIn; // ISO date string for UI
    private Integer due;

    public static TenantResponse from(Tenants t) {
        TenantResponse r = new TenantResponse();
        r.id = t.getId();
        r.tenantId = t.getTenantId();
        r.name = t.getName();
        r.phone = t.getPhone();
        r.room = t.getRoom();
        r.checkIn = t.getCheckIn().toString();
        r.due = t.getDue();
        return r;
    }

    // getters
    public Long getId() { return id; }
    public String getTenantId() { return tenantId; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getRoom() { return room; }
    public String getCheckIn() { return checkIn; }
    public Integer getDue() { return due; }
}

