package com.recruitment.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {

    private long totalUsers;
    private long totalJobSeekers;
    private long totalHrUsers;
    private long totalAdmins;

    private long totalCompanies;
    private long pendingCompanies;
    private long approvedCompanies;
    private long rejectedCompanies;

    private long totalJobs;
    private long activeJobs;
    private long draftJobs;
    private long closedJobs;

    private long totalApplications;
}
