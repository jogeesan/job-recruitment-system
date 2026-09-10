package com.recruitment.backend.dto.company;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CompanyDashboardResponse {
    private CompanyProfileResponse company;
    private long totalJobs;
    private long activeJobs;
    private long totalApplications;
    private long shortlistedApplications;
}
