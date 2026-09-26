package com.recruitment.backend.controller;

import com.recruitment.backend.dto.common.ApiResponse;
import com.recruitment.backend.dto.notification.NotificationResponse;
import com.recruitment.backend.entity.Notification;
import com.recruitment.backend.entity.User;
import com.recruitment.backend.repository.NotificationRepository;
import com.recruitment.backend.repository.UserRepository;
import com.recruitment.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('JOB_SEEKER', 'HR', 'ADMIN')")
public class NotificationController {
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(
            @AuthenticationPrincipal UserDetails details) {
        User user = getUser(details);
        return ResponseEntity.ok(ApiResponse.ok("Notifications retrieved successfully",
                notificationService.listForUser(user.getId())));
    }

    @GetMapping("/unread-count")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@AuthenticationPrincipal UserDetails details) {
        return ResponseEntity.ok(ApiResponse.ok("Unread notification count retrieved successfully",
                notificationService.unreadCount(getUser(details).getId())));
    }

    @PutMapping("/{notificationId}/read")
    @Transactional
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(
            @AuthenticationPrincipal UserDetails details,
            @PathVariable Long notificationId) {
        User user = getUser(details);
        Notification notification = notificationRepository.findById(notificationId)
                .filter(item -> item.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        notification.setIsRead(true);
        return ResponseEntity.ok(ApiResponse.ok("Notification marked as read",
                notificationService.toResponse(notification)));
    }

    @PutMapping("/read-all")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@AuthenticationPrincipal UserDetails details) {
        notificationRepository.markAllAsReadByUserId(getUser(details).getId());
        return ResponseEntity.ok(ApiResponse.ok("Notifications marked as read", null));
    }

    private User getUser(UserDetails details) {
        return userRepository.findByEmail(details.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
