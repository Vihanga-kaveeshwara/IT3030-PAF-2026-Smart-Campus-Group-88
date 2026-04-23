package com.smartcampus.smart_campus_api.dto.responce;

import com.smartcampus.smart_campus_api.model.notification.NotificationType;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class NotificationResponse {
    private String id;
    private NotificationType type;
    private String title;
    private String message;
    private String referenceId;
    private String referenceType;
    private boolean read;
    private Instant createdAt;
}
