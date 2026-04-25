package com.smartcampus.smart_campus_api.dto.request.ticket;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateTicketStatusRequest {
    @NotBlank(message = "Status is required")
    private String status;
}
