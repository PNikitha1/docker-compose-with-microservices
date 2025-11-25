package com.example.Roomsmicroservice.dto;

import com.example.Roomsmicroservice.model.Room;
import com.example.Roomsmicroservice.model.RoomStatus;

public class RoomResponse {
	
    private Long id;
    private String name;
    private String type;
    private int capacity;
    private int occupied;
    private int price;
    private String status; // "Full" or "Available" (capitalized like UI)

    public static RoomResponse from(Room r) {
        RoomResponse res = new RoomResponse();
        res.id = r.getId();
        res.name = r.getName();
        res.type = r.getType();
        res.capacity = r.getCapacity();
        res.occupied = r.getOccupied();
        res.price = r.getPrice();
        res.status = (r.getStatus() == RoomStatus.FULL ? "Full" : "Available");
        return res;
    }

    // getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getType() { return type; }
    public int getCapacity() { return capacity; }
    public int getOccupied() { return occupied; }
    public int getPrice() { return price; }
    public String getStatus() { return status; }
}
 
