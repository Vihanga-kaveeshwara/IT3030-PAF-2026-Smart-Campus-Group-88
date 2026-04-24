package com.smartcampus.smart_campus_api.dto.request.ticket;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AssignTicketRequest {
    @NotBlank(message = "Assignee ID is required")
    private String assignee;
}
