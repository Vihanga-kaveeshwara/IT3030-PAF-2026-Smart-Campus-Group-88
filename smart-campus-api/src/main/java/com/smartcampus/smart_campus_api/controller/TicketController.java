// Backend: src/main/java/com/smartcampus/smart_campus_api/controller/TicketController.java
package com.smartcampus.smart_campus_api.controller;

import com.smartcampus.smart_campus_api.dto.TicketCreateDto;
import com.smartcampus.smart_campus_api.dto.TicketCommentCreateDto;
import com.smartcampus.smart_campus_api.model.Ticket;
import com.smartcampus.smart_campus_api.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<Ticket> createTicket(
            @Valid @RequestBody TicketCreateDto dto,
            @RequestHeader(value = "user-id", required = false) String userIdHeader,
            Principal principal
    ) {
        String userId = resolveUserId(userIdHeader, principal);
        Ticket ticket = ticketService.createTicket(dto, userId);
        return new ResponseEntity<>(ticket, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<List<Ticket>> getMyTickets(
            @RequestHeader(value = "user-id", required = false) String userIdHeader,
            Principal principal
    ) {
        String userId = resolveUserId(userIdHeader, principal);
        List<Ticket> tickets = ticketService.getUserTickets(userId);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicket(@PathVariable String id) {
        Ticket ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ticket);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<Ticket> updateUserTicket(
            @PathVariable String id,
            @Valid @RequestBody TicketCreateDto dto,
            @RequestHeader(value = "user-id", required = false) String userIdHeader,
            Principal principal
    ) {
        String userId = resolveUserId(userIdHeader, principal);
        return ResponseEntity.ok(ticketService.updateUserTicket(id, dto, userId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<Void> deleteUserTicket(
            @PathVariable String id,
            @RequestHeader(value = "user-id", required = false) String userIdHeader,
            Principal principal
    ) {
        String userId = resolveUserId(userIdHeader, principal);
        ticketService.deleteUserTicket(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/comments")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<Ticket> addComment(@PathVariable String id, @RequestBody TicketCommentCreateDto dto) {
        return ResponseEntity.ok(ticketService.addComment(id, dto));
    }

    // Admin Endpoints
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Ticket> assignTicket(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(ticketService.assignTicket(id, payload.get("assignee")));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Ticket> updateTicketStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(ticketService.updateStatus(id, payload.get("status")));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Ticket> rejectTicket(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(ticketService.rejectTicket(id, payload.get("reason")));
    }

    // Technician Endpoints
    @GetMapping("/assigned")
    @PreAuthorize("hasAnyRole('TECHNICIAN', 'ADMIN')")
    public ResponseEntity<List<Ticket>> getAssignedTickets(
            @RequestHeader(value = "user-id", required = false) String userIdHeader,
            Principal principal
    ) {
        String assigneeUsername = resolveUserId(userIdHeader, principal);
        return ResponseEntity.ok(ticketService.getAssignedTickets(assigneeUsername));
    }

    @PatchMapping("/{id}/start-work")
    @PreAuthorize("hasAnyRole('TECHNICIAN', 'ADMIN')")
    public ResponseEntity<Ticket> startWork(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.startWork(id));
    }

    @PatchMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('TECHNICIAN', 'ADMIN')")
    public ResponseEntity<Ticket> resolveTicket(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(ticketService.resolveTicket(id, payload.get("resolutionNotes")));
    }

    @PatchMapping("/{id}/progress")
    @PreAuthorize("hasAnyRole('TECHNICIAN', 'ADMIN')")
    public ResponseEntity<Ticket> updateWorkProgress(@PathVariable String id, @RequestBody Map<String, Integer> payload) {
        Integer progress = payload.get("progress");
        return ResponseEntity.ok(ticketService.updateWorkProgress(id, progress != null ? progress : 0));
    }

    private String resolveUserId(String userIdHeader, Principal principal) {
        if (userIdHeader != null && !userIdHeader.isBlank()) {
            return userIdHeader;
        }
        return principal != null ? principal.getName() : "anonymous_user";
    }
}
