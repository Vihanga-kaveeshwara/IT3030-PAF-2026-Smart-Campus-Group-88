package com.smartcampus.smart_campus_api.controller.ticket;

import com.smartcampus.smart_campus_api.dto.request.ticket.AssignTicketRequest;
import com.smartcampus.smart_campus_api.dto.request.ticket.CreateTicketRequest;
import com.smartcampus.smart_campus_api.dto.request.ticket.RejectTicketRequest;
import com.smartcampus.smart_campus_api.dto.request.ticket.UpdateTicketStatusRequest;
import com.smartcampus.smart_campus_api.dto.responce.ticket.TicketResponse;
import com.smartcampus.smart_campus_api.model.ticket.Ticket;
import com.smartcampus.smart_campus_api.model.ticket.TicketStatus;
import com.smartcampus.smart_campus_api.service.ticket.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(@Valid @RequestBody CreateTicketRequest request) {
        Ticket ticket = ticketService.createTicket(request);
        return new ResponseEntity<>(TicketResponse.fromEntity(ticket), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable String id) {
        Ticket ticket = ticketService.getTicketById(id);
        return new ResponseEntity<>(TicketResponse.fromEntity(ticket), HttpStatus.OK);
    }

    @GetMapping("/my")
    public ResponseEntity<List<TicketResponse>> getMyTickets(@RequestParam String reporterId) {
        List<TicketResponse> responses = ticketService.getTicketsByReporter(reporterId)
            .stream()
            .map(TicketResponse::fromEntity)
            .toList();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets(
            @RequestParam(required = false) TicketStatus status) {
        List<TicketResponse> responses;
        if (status != null) {
            responses = ticketService.getTicketsByStatus(status)
                .stream()
                .map(TicketResponse::fromEntity)
                .toList();
        } else {
            responses = ticketService.getAllTickets()
                .stream()
                .map(TicketResponse::fromEntity)
                .toList();
        }
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<TicketResponse> assignTicket(
            @PathVariable String id,
            @Valid @RequestBody AssignTicketRequest request) {
        Ticket ticket = ticketService.assignTicket(id, request.getAssignee());
        return new ResponseEntity<>(TicketResponse.fromEntity(ticket), HttpStatus.OK);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketResponse> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateTicketStatusRequest request) {
        Ticket ticket = ticketService.updateTicketStatus(id, request.getStatus());
        return new ResponseEntity<>(TicketResponse.fromEntity(ticket), HttpStatus.OK);
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<TicketResponse> rejectTicket(
            @PathVariable String id,
            @Valid @RequestBody RejectTicketRequest request) {
        Ticket ticket = ticketService.rejectTicket(id, request.getReason());
        return new ResponseEntity<>(TicketResponse.fromEntity(ticket), HttpStatus.OK);
    }

    @GetMapping("/assignee/{assigneeId}")
    public ResponseEntity<List<TicketResponse>> getTicketsByAssignee(@PathVariable String assigneeId) {
        List<TicketResponse> responses = ticketService.getTicketsByAssignee(assigneeId)
            .stream()
            .map(TicketResponse::fromEntity)
            .toList();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }
}
