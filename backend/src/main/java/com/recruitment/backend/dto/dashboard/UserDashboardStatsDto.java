package com.recruitment.backend.dto.dashboard;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDashboardStatsDto {

    // common
    private String role;

    // JOB_SEEKER
    private Long availableJobs;
    private Long myApplications;
    private Long underReview;
    private Long interviews;

    // HR
    private Long activeJobs;
    private Long totalApplications;
    private Long pendingReview;
    private Long hired;
}
