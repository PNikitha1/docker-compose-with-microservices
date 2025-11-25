package com.example.Ticketssmicroservice.dto;


import com.example.Ticketssmicroservice.model.TicketStatus;

import jakarta.validation.constraints.NotNull;

public class UpdateStatusRequest {
    @NotNull
    private TicketStatus status;

    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }
}
