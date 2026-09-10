package com.recruitment.backend.controller;

import com.recruitment.backend.dto.common.ApiResponse;
import com.recruitment.backend.dto.dashboard.UserDashboardStatsDto;
import com.recruitment.backend.entity.User;
import com.recruitment.backend.repository.UserRepository;
import com.recruitment.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserRepository userRepository;

    // GET /api/dashboard/stats  — returns role-based real stats for logged-in user
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<UserDashboardStatsDto>> getStats(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String role = user.getRole().getName();
        UserDashboardStatsDto stats;

        switch (role) {
            case "JOB_SEEKER" -> stats = dashboardService.getJobSeekerStats(user.getId());
            case "HR"         -> stats = dashboardService.getHrStats(user.getId());
            default           -> stats = UserDashboardStatsDto.builder().role(role).build();
        }

        return ResponseEntity.ok(ApiResponse.ok("Dashboard stats", stats));
    }
}
