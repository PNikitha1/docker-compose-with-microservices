package com.example.Roomsmicroservice.dto;

public class RoomRequest { 
    private String name;
    private String type;
    private int capacity;
    private int occupied;
    private int price;

    // getters/setters
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
}

