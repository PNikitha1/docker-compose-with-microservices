package com.example.Roomsmicroservice.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Roomsmicroservice.dto.RoomRequest;
import com.example.Roomsmicroservice.dto.RoomResponse;
import com.example.Roomsmicroservice.model.Room;
import com.example.Roomsmicroservice.service.RoomService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/rooms")

public class RoomController {

    private final RoomService service;

    public RoomController(RoomService service) {
        this.service = service;
    }

    // GET /api/rooms?q=...
    @GetMapping
    public List<RoomResponse> list(@RequestParam(value = "q", required = false) String q) {
        return service.getAll(q).stream().map(RoomResponse::from).toList();
    }

    // GET /api/rooms/{id}
    @GetMapping("/{id}")
    public RoomResponse get(@PathVariable Long id) {
        return RoomResponse.from(service.getById(id));
    }

    
    
    // POST /api/rooms
    @PostMapping
    public ResponseEntity<RoomResponse> create( @RequestBody RoomRequest req) {
        Room r = new Room();
        r.setName(req.getName());
        r.setType(req.getType());
        r.setCapacity(req.getCapacity());
        r.setOccupied(req.getOccupied());
        r.setPrice(req.getPrice());
        Room saved = service.create(r);
        return ResponseEntity.created(URI.create("/api/rooms/" + saved.getId())).body(RoomResponse.from(saved));
    }

    // PUT /api/rooms/{id}
    @PutMapping("/{id}")
    public RoomResponse update(@PathVariable Long id, @RequestBody RoomRequest req) {
        Room patch = new Room();
        patch.setName(req.getName());
        patch.setType(req.getType());
        patch.setCapacity(req.getCapacity());
        patch.setOccupied(req.getOccupied());
        patch.setPrice(req.getPrice());
        return RoomResponse.from(service.update(id, patch));
    }

    // POST /api/rooms/{id}/allocate
    @PostMapping("/{id}/allocate")
    public RoomResponse allocate(@PathVariable Long id) {
        return RoomResponse.from(service.allocate(id));
    }

    // DELETE /api/rooms/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

