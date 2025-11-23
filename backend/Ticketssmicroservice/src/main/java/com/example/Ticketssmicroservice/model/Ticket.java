package com.example.Ticketssmicroservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.Instant;

@Entity
@Table(name = "tickets", indexes = {
    @Index(name = "idx_tickets_ticket_id", columnList = "ticket_id", unique = true),
    @Index(name = "idx_tickets_status", columnList = "status"),
    @Index(name = "idx_tickets_created_at", columnList = "created_at")
})
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // numeric PK in H2
    private Long id;

    /** Human-friendly id, e.g. "M123" */
    @Column(name = "ticket_id", nullable = false, unique = true, length = 16)
    private String ticketId;

    @NotBlank
    @Size(max = 200)
    @Column(nullable = false, length = 200)
    private String title;

    @Size(max = 20)
    @Column(length = 20)
    private String room;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TicketPriority priority;

    @Size(max = 2000)
    @Column(length = 2000)
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 12)
    private TicketStatus status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    public void prePersist() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.status == null) this.status = TicketStatus.OPEN;
        if (this.priority == null) this.priority = TicketPriority.MEDIUM;
        if (this.ticketId == null || this.ticketId.isBlank()) {
            this.ticketId = generateHumanId();
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    private String generateHumanId() {
        // simple human id "M" + random 3 digits; replace with a sequence if needed
        return "M" + (int)(Math.random() * 1000);
    }

    // getters & setters
    public Long getId() { return id; }
    public String getTicketId() { return ticketId; }
    public void setTicketId(String ticketId) { this.ticketId = ticketId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }
    public TicketPriority getPriority() { return priority; }
    public void setPriority(TicketPriority priority) { this.priority = priority; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
