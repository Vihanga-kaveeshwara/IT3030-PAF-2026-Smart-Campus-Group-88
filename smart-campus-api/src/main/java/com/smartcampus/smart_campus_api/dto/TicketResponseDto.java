// Backend: src/main/java/com/smartcampus/smart_campus_api/dto/TicketResponseDto.java
package com.smartcampus.smart_campus_api.dto;

import com.smartcampus.smart_campus_api.model.Ticket;

public class TicketResponseDto {
    // Basic representation class, though we can return Ticket directly. Made as requested.
    private Ticket ticket;
    private String message;

    public TicketResponseDto(Ticket ticket, String message) {
        this.ticket = ticket;
        this.message = message;
    }

    public Ticket getTicket() { return ticket; }
    public void setTicket(Ticket ticket) { this.ticket = ticket; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
