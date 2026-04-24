package com.smartcampus.smart_campus_api.dto.request.ticket;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateTicketRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Reporter ID is required")
    private String reporterId;

    private String resourceId;

    @NotBlank(message = "Location is required")
    private String location;
}
