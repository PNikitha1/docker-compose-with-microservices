package com.example.Roomsmicroservice.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.example.Roomsmicroservice.model.*;
import com.example.Roomsmicroservice.repository.RoomRepository;

import java.util.List;

@Service
@Transactional
public class RoomService {

    private final RoomRepository repo;

    public RoomService(RoomRepository repo) {
        this.repo = repo;
    }

    public List<Room> getAll(String q) {
        if (StringUtils.hasText(q)) {
            return repo.search(q.trim());
        }
        return repo.findAll();
    }

    public Room getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Room not found: " + id));
    }

    public Room create(Room r) {
        r.recomputeStatus();
        return repo.save(r);
    }

    public Room update(Long id, Room patch) {
        Room r = getById(id);
        r.setName(patch.getName());
        r.setType(patch.getType());
        r.setCapacity(patch.getCapacity());
        r.setOccupied(patch.getOccupied());
        r.setPrice(patch.getPrice());
        r.recomputeStatus();
        return repo.save(r);
    }

    /** Allocate one seat in the room and recompute status. */
    public Room allocate(Long id) {
        Room r = getById(id);
        if (r.getOccupied() >= r.getCapacity()) {
            throw new IllegalStateException("Room is already full");
        }
        r.setOccupied(r.getOccupied() + 1);
        r.recomputeStatus();
        return repo.save(r);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}

