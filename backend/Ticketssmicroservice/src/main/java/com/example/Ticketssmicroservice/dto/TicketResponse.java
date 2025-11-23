package com.example.Ticketssmicroservice.dto;

import com.example.Ticketssmicroservice.model.Ticket;

public class TicketResponse {

    private Long id;
    private String ticketId;
    private String title;
    private String room;
    private String priority;  // "Low/Medium/High" to match UI
    private String description;
    private String status;    // "Open/In Progress/Closed" readable
    private String createdAt;

    public static TicketResponse from(Ticket t) {
        TicketResponse r = new TicketResponse();
        r.id = t.getId();
        r.ticketId = t.getTicketId();
        r.title = t.getTitle();
        r.room = t.getRoom();
        r.priority = switch (t.getPriority()) {
            case LOW -> "Low";
            case MEDIUM -> "Medium";
            case HIGH -> "High";
        };
        r.description = t.getDescription();
        r.status = switch (t.getStatus()) {
            case OPEN -> "Open";
            case IN_PROGRESS -> "In Progress";
            case CLOSED -> "Closed";
        };
        r.createdAt = t.getCreatedAt().toString(); // ISO
        return r;
    }

    // getters
    public Long getId() { return id; }
    public String getTicketId() { return ticketId; }
    public String getTitle() { return title; }
    public String getRoom() { return room; }
    public String getPriority() { return priority; }
    public String getDescription() { return description; }
    public String getStatus() { return status; }
    public String getCreatedAt() { return createdAt; }
}
