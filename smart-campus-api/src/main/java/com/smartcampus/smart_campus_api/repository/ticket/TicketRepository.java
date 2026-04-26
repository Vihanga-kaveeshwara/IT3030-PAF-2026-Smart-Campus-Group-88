// Backend: src/main/java/com/smartcampus/smart_campus_api/repository/TicketRepository.java
package com.smartcampus.smart_campus_api.repository.ticket;

import com.smartcampus.smart_campus_api.model.ticket.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByUserIdOrderByCreatedDateDesc(String userId);
    List<Ticket> findByAssigneeIgnoreCaseOrderByCreatedDateDesc(String assignee);
}
