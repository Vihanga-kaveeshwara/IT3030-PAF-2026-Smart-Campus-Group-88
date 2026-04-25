package com.smartcampus.smart_campus_api.dto.request.ticket;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RejectTicketRequest {
    @NotBlank(message = "Reason is required")
    private String reason;
}
