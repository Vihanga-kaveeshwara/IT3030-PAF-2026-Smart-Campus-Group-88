package com.smartcampus.smart_campus_api.controller.notification;

import com.smartcampus.smart_campus_api.dto.responce.NotificationResponse;
import com.smartcampus.smart_campus_api.service.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // GET /api/notifications?page=0&size=20
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<Page<NotificationResponse>> getNotifications(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
                notificationService.getNotifications(userDetails.getUsername(), page, size));
    }

    // GET /api/notifications/unread-count
    @GetMapping("/unread-count")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @AuthenticationPrincipal UserDetails userDetails) {
        long count = notificationService.getUnreadCount(userDetails.getUsername());
        return ResponseEntity.ok(Map.of("count", count));
    }

    // PATCH /api/notifications/{id}/read
    @PatchMapping("/{id}/read")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<NotificationResponse> markAsRead(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                notificationService.markAsRead(id, userDetails.getUsername()));
    }

    // PATCH /api/notifications/read-all
    @PatchMapping("/read-all")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<Void> markAllAsRead(
            @AuthenticationPrincipal UserDetails userDetails) {
        notificationService.markAllAsRead(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    // DELETE /api/notifications/{id}
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        notificationService.deleteNotification(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
