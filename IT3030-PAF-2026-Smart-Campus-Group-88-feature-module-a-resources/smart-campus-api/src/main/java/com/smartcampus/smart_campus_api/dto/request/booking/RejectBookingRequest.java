package com.smartcampus.smart_campus_api.dto.request.booking;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RejectBookingRequest {

    @NotBlank(message = "Rejection reason is required")
    private String reason;
}
