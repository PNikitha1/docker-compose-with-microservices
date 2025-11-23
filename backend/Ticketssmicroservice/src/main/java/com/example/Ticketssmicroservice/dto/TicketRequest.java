package com.example.Ticketssmicroservice.dto;

import com.example.Ticketssmicroservice.model.TicketPriority;

import jakarta.validation.constraints.*;

public class TicketRequest {

    @NotBlank @Size(max = 200)
    private String title;

    @Size(max = 20)
    private String room;

    @NotNull
    private TicketPriority priority;

    @Size(max = 2000)
    private String description;

    // getters/setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }
    public TicketPriority getPriority() { return priority; }
    public void setPriority(TicketPriority priority) { this.priority = priority; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

