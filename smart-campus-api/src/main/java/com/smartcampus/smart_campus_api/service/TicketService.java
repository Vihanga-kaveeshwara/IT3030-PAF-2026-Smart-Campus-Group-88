// Backend: src/main/java/com/smartcampus/smart_campus_api/service/TicketService.java
package com.smartcampus.smart_campus_api.service;

import com.smartcampus.smart_campus_api.dto.TicketCreateDto;
import com.smartcampus.smart_campus_api.model.Ticket;
import com.smartcampus.smart_campus_api.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    public Ticket createTicket(TicketCreateDto dto, String userId) {
        Ticket ticket = new Ticket();
        ticket.setResourceLocation(dto.getResourceLocation());
        ticket.setCategory(dto.getCategory());
        ticket.setDescription(dto.getDescription());
        ticket.setPriority(dto.getPriority());
        ticket.setContactDetails(dto.getContactDetails());
        ticket.setStatus("Open");
        ticket.setCreatedDate(LocalDateTime.now());
        ticket.setUserId(userId);
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getUserTickets(String userId) {
        return ticketRepository.findByUserIdOrderByCreatedDateDesc(userId);
    }

    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Ticket assignTicket(String id, String assignee) {
        Ticket ticket = getTicketById(id);
        ticket.setAssignee(assignee);
        ticket.setStatus("Assigned");
        return ticketRepository.save(ticket);
    }

    public Ticket updateStatus(String id, String status) {
        Ticket ticket = getTicketById(id);
        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }

    public Ticket rejectTicket(String id, String reason) {
        Ticket ticket = getTicketById(id);
        ticket.setStatus("Rejected");
        ticket.setRejectionReason(reason);
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAssignedTickets(String assignee) {
        return ticketRepository.findByAssignee(assignee);
    }

    public Ticket startWork(String id) {
        Ticket ticket = getTicketById(id);
        ticket.setStatus("In Progress");
        return ticketRepository.save(ticket);
    }

    public Ticket resolveTicket(String id, String resolutionNotes) {
        Ticket ticket = getTicketById(id);
        ticket.setStatus("Resolved");
        ticket.setResolutionNotes(resolutionNotes);
        return ticketRepository.save(ticket);
    }
}
