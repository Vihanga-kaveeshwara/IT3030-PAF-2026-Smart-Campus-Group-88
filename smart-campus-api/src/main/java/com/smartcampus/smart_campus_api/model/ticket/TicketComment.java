package com.smartcampus.smart_campus_api.model.ticket;

import java.time.LocalDateTime;

public class TicketComment {
    private String authorName;
    private String authorRole;
    private String content;
    private LocalDateTime timestamp;

    public TicketComment() {}

    public TicketComment(String authorName, String authorRole, String content, LocalDateTime timestamp) {
        this.authorName = authorName;
        this.authorRole = authorRole;
        this.content = content;
        this.timestamp = timestamp;
    }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorRole() { return authorRole; }
    public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
