// Backend: src/main/java/com/smartcampus/smart_campus_api/controller/TicketController.java
package com.smartcampus.smart_campus_api.controller;

import com.smartcampus.smart_campus_api.dto.TicketCreateDto;
import com.smartcampus.smart_campus_api.model.Ticket;
import com.smartcampus.smart_campus_api.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody TicketCreateDto dto, Principal principal) {
        String userId = principal != null ? principal.getName() : "anonymous_user";
        Ticket ticket = ticketService.createTicket(dto, userId);
        return new ResponseEntity<>(ticket, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets(Principal principal) {
        String userId = principal != null ? principal.getName() : "anonymous_user";
        List<Ticket> tickets = ticketService.getUserTickets(userId);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicket(@PathVariable String id) {
        Ticket ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ticket);
    }

    // Admin Endpoints
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<Ticket> assignTicket(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(ticketService.assignTicket(id, payload.get("assignee")));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateTicketStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(ticketService.updateStatus(id, payload.get("status")));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<Ticket> rejectTicket(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(ticketService.rejectTicket(id, payload.get("reason")));
    }

    // Technician Endpoints
    @GetMapping("/assigned")
    public ResponseEntity<List<Ticket>> getAssignedTickets(Principal principal) {
        String assigneeUsername = principal != null ? principal.getName() : "Mike Johnson (Technician)"; // fallback for testing
        return ResponseEntity.ok(ticketService.getAssignedTickets(assigneeUsername));
    }

    @PatchMapping("/{id}/start-work")
    public ResponseEntity<Ticket> startWork(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.startWork(id));
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<Ticket> resolveTicket(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(ticketService.resolveTicket(id, payload.get("resolutionNotes")));
    }
}
