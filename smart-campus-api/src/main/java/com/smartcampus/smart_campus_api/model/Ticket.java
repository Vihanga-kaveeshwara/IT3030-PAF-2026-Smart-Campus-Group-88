package com.smartcampus.smart_campus_api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    private String resourceLocation;
    private String category;
    private String description;
    private String priority;
    private String contactDetails;
    private String status;
    private LocalDateTime createdDate;
    private String userId;

    public Ticket() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
