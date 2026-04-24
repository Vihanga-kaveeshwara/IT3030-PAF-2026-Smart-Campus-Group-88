package com.smartcampus.smart_campus_api.dto.responce.ticket;

import com.smartcampus.smart_campus_api.model.ticket.Ticket;
import com.smartcampus.smart_campus_api.model.ticket.TicketStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TicketResponse {
    private String id;
    private String title;
    private String description;
    private String reporterId;
    private String assigneeId;
    private String resourceId;
    private String location;
    private TicketStatus status;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    public static TicketResponse fromEntity(Ticket ticket) {
        TicketResponse response = new TicketResponse();
        response.setId(ticket.getId());
        response.setTitle(ticket.getTitle());
        response.setDescription(ticket.getDescription());
        response.setReporterId(ticket.getReporterId());
        response.setAssigneeId(ticket.getAssigneeId());
        response.setResourceId(ticket.getResourceId());
        response.setLocation(ticket.getLocation());
        response.setStatus(ticket.getStatus());
        response.setRejectionReason(ticket.getRejectionReason());
        response.setCreatedAt(ticket.getCreatedAt());
        response.setUpdatedAt(ticket.getUpdatedAt());
        response.setResolvedAt(ticket.getResolvedAt());
        return response;
    }
}
