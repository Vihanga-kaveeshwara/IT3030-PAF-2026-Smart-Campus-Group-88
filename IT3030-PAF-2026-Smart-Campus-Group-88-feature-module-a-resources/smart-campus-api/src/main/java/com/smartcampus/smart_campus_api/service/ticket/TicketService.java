package com.smartcampus.smart_campus_api.service.ticket;

import com.smartcampus.smart_campus_api.dto.request.ticket.CreateTicketRequest;
import com.smartcampus.smart_campus_api.exception.BookingNotFoundException;
import com.smartcampus.smart_campus_api.model.ticket.Ticket;
import com.smartcampus.smart_campus_api.model.ticket.TicketStatus;
import com.smartcampus.smart_campus_api.repository.ticket.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    public Ticket createTicket(CreateTicketRequest request) {
        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setReporterId(request.getReporterId());
        ticket.setResourceId(request.getResourceId());
        ticket.setLocation(request.getLocation());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public Ticket getTicketById(String ticketId) {
        return ticketRepository.findById(ticketId)
            .orElseThrow(() -> new BookingNotFoundException("Ticket not found with id: " + ticketId));
    }

    public List<Ticket> getTicketsByReporter(String reporterId) {
        return ticketRepository.findByReporterId(reporterId);
    }

    public List<Ticket> getTicketsByAssignee(String assigneeId) {
        return ticketRepository.findByAssigneeId(assigneeId);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status);
    }

    public Ticket assignTicket(String ticketId, String assigneeId) {
        Ticket ticket = getTicketById(ticketId);
        ticket.setAssigneeId(assigneeId);
        ticket.setStatus(TicketStatus.ASSIGNED);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicketStatus(String ticketId, String status) {
        Ticket ticket = getTicketById(ticketId);
        try {
            TicketStatus newStatus = TicketStatus.valueOf(status.toUpperCase());
            ticket.setStatus(newStatus);
            if (newStatus == TicketStatus.CLOSED) {
                ticket.setResolvedAt(LocalDateTime.now());
            }
            ticket.setUpdatedAt(LocalDateTime.now());
            return ticketRepository.save(ticket);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
    }

    public Ticket rejectTicket(String ticketId, String reason) {
        Ticket ticket = getTicketById(ticketId);
        ticket.setStatus(TicketStatus.REJECTED);
        ticket.setRejectionReason(reason);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }
}
