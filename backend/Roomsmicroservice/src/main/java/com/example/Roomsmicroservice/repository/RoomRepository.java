package com.example.Roomsmicroservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.Roomsmicroservice.model.Room;
import com.example.Roomsmicroservice.model.RoomStatus;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByStatus(RoomStatus status);

    @Query("""
           select r from Room r
           where lower(r.name) like lower(concat('%', :q, '%'))
              or lower(r.type) like lower(concat('%', :q, '%'))
              or lower(r.status) = lower(:q)
           """)
    List<Room> search(String q);
}
