package com.example.Roomsmicroservice.model;

import jakarta.persistence.*;

@Entity
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // numeric PK in H2
    private Long roomId;

    @Column(nullable = false, unique = true, length = 20)
    private String name; // e.g., "A1"

    @Column(nullable = false, length = 50)
    private String type; // e.g., "3-sharing"

    @Column(nullable = false)
    private int capacity;

 
    @Column(nullable = false)
    private int occupied;

    @Column(nullable = false)
    private int price; // monthly INR price

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 12)
    private RoomStatus status;

    // --- helpers ---
    public void recomputeStatus() {
        this.status = (occupied >= capacity) ? RoomStatus.FULL : RoomStatus.AVAILABLE;
    }

    // --- getters & setters ---
    public Long getId() { return roomId; }
    public void setId(Long id) { this.roomId = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public int getOccupied() { return occupied; }
    public void setOccupied(int occupied) { this.occupied = occupied; }

    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }

    public RoomStatus getStatus() { return status; }
    public void setStatus(RoomStatus status) { this.status = status; }
}

