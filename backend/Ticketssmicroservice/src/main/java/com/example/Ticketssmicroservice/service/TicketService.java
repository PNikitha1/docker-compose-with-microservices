package com.example.Ticketssmicroservice.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.example.Ticketssmicroservice.model.Ticket;
import com.example.Ticketssmicroservice.model.TicketStatus;
import com.example.Ticketssmicroservice.repository.TicketRepository;

import java.util.List;

@Service
@Transactional
public class TicketService {

    private final TicketRepository repo;

    public TicketService(TicketRepository repo) {
        this.repo = repo;
    }

    public List<Ticket> getAll(String q) {
        if (StringUtils.hasText(q)) {
            String s = q.trim();
            return repo.findByTitleContainingIgnoreCaseOrRoomContainingIgnoreCaseOrderByCreatedAtDesc(s, s);
        }
        return repo.findTop10ByOrderByCreatedAtDesc();
    }

    public Ticket getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Ticket not found: " + id));
    }

    public Ticket create(Ticket t) {
        // status/priority & timestamps handled in @PrePersist
        return repo.save(t);
    }

    public Ticket updateStatus(Long id, TicketStatus newStatus) {
        Ticket t = getById(id);
        t.setStatus(newStatus);
        return repo.save(t);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}

