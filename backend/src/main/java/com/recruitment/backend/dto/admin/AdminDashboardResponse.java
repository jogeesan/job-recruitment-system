package com.recruitment.backend.dto.admin;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminDashboardResponse {
    private long totalUsers;
    private long totalJobSeekers;
    private long totalHrUsers;
    private long totalCompanies;
    private long pendingCompanies;
    private long totalJobs;
    private long activeJobs;
    private long totalApplications;
}
