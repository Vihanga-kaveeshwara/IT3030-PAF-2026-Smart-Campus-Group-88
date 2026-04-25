package com.smartcampus.smart_campus_api.dto.request;

public class TicketCommentCreateDto {
    private String authorName;
    private String authorRole;
    private String content;

    public TicketCommentCreateDto() {}

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorRole() { return authorRole; }
    public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
