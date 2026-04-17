package com.smartcampus.smart_campus_api.dto;

public class TicketCreateDto {
    private String resourceLocation;
    private String category;
    private String description;
    private String priority;
    private String contactDetails;

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
}
