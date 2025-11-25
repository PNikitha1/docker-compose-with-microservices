package com.example.Ticketssmicroservice.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Ticketssmicroservice.model.Ticket;
import com.example.Ticketssmicroservice.model.TicketStatus;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findTop10ByOrderByCreatedAtDesc();

    List<Ticket> findByStatusOrderByCreatedAtDesc(TicketStatus status);

    List<Ticket> findByTitleContainingIgnoreCaseOrRoomContainingIgnoreCaseOrderByCreatedAtDesc(
            String title, String room);
}
