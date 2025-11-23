package com.example.Ticketssmicroservice.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Ticketssmicroservice.dto.TicketRequest;
import com.example.Ticketssmicroservice.dto.TicketResponse;
import com.example.Ticketssmicroservice.dto.UpdateStatusRequest;
import com.example.Ticketssmicroservice.model.Ticket;
import com.example.Ticketssmicroservice.model.TicketPriority;
import com.example.Ticketssmicroservice.model.TicketStatus;
import com.example.Ticketssmicroservice.service.TicketService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/tickets")
public class TicketController {

	@Autowired
    private TicketService service;

    // GET /api/tickets?q=...
    @GetMapping
    public List<TicketResponse> list(@RequestParam(value = "q", required = false) String q) {
        return service.getAll(q).stream().map(TicketResponse::from).toList();
    }

    // GET /api/tickets/{id}
    @GetMapping("/{id}")
    public TicketResponse get(@PathVariable Long id) {
        return TicketResponse.from(service.getById(id));
    }

    // POST /api/tickets
    @PostMapping
    public ResponseEntity<TicketResponse> create(@Valid @RequestBody TicketRequest req) {
        Ticket t = new Ticket();
        t.setTitle(req.getTitle());
        t.setRoom(req.getRoom());
        t.setPriority(req.getPriority() != null ? req.getPriority() : TicketPriority.MEDIUM);
        t.setDescription(req.getDescription());
        t.setStatus(TicketStatus.OPEN);
        Ticket saved = service.create(t);
        return ResponseEntity.created(URI.create("/api/tickets/" + saved.getId()))
                             .body(TicketResponse.from(saved));
    }

    // PATCH /api/tickets/{id}/status
    @PatchMapping("/{id}/status")
    public TicketResponse updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateStatusRequest req) {
        return TicketResponse.from(service.updateStatus(id, req.getStatus()));
    }

    // DELETE /api/tickets/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
