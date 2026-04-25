package com.smartcampus.smart_campus_api.repository.ticket;

import com.smartcampus.smart_campus_api.model.ticket.Ticket;
import com.smartcampus.smart_campus_api.model.ticket.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByReporterId(String reporterId);
    List<Ticket> findByAssigneeId(String assigneeId);
    List<Ticket> findByStatus(TicketStatus status);
    List<Ticket> findByResourceId(String resourceId);
}
