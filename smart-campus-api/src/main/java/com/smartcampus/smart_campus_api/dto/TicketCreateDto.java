package com.smartcampus.smart_campus_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public class TicketCreateDto {
    @NotBlank(message = "Resource location is required")
    @Size(min = 5, max = 120, message = "Resource location must be between 5 and 120 characters")
    private String resourceLocation;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Description is required")
    @Size(min = 20, max = 1000, message = "Description must be between 20 and 1000 characters")
    private String description;

    @NotBlank(message = "Priority is required")
    private String priority;

    @NotBlank(message = "Contact details are required")
    @Size(min = 6, max = 120, message = "Contact details must be between 6 and 120 characters")
    private String contactDetails;

    @Size(max = 3, message = "A maximum of 3 images can be attached")
    private List<String> images;

    public TicketCreateDto() {}

    public String getResourceLocation() { return resourceLocation; }
    public void setResourceLocation(String resourceLocation) { this.resourceLocation = resourceLocation; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getContactDetails() { return contactDetails; }
    public void setContactDetails(String contactDetails) { this.contactDetails = contactDetails; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
}
