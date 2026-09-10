package com.recruitment.backend.service;

import com.recruitment.backend.dto.dashboard.UserDashboardStatsDto;
import com.recruitment.backend.entity.Company;
import com.recruitment.backend.entity.JobSeeker;
import com.recruitment.backend.repository.ApplicationRepository;
import com.recruitment.backend.repository.CompanyRepository;
import com.recruitment.backend.repository.JobRepository;
import com.recruitment.backend.repository.JobSeekerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final CompanyRepository companyRepository;

    // ─── JOB_SEEKER Stats ────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public UserDashboardStatsDto getJobSeekerStats(Long userId) {

        // Find JobSeeker profile by userId
        JobSeeker seeker = jobSeekerRepository.findByUserId(userId)
                .orElse(null);

        long availableJobs = jobRepository.countByCompanyIdAndStatus(null, "OPEN");
        // Override: count all OPEN jobs
        availableJobs = jobRepository.findByStatus("OPEN").size();

        long myApplications = 0;
        long underReview = 0;
        long interviews = 0;

        if (seeker != null) {
            Long seekerId = seeker.getId();
            myApplications = applicationRepository.countByJobSeekerId(seekerId);
            underReview    = applicationRepository.countByJobSeekerIdAndStatus(seekerId, "REVIEWING");
            interviews     = applicationRepository.countByJobSeekerIdAndStatus(seekerId, "INTERVIEW");
        }

        return UserDashboardStatsDto.builder()
                .role("JOB_SEEKER")
                .availableJobs(availableJobs)
                .myApplications(myApplications)
                .underReview(underReview)
                .interviews(interviews)
                .build();
    }

    // ─── HR Stats ─────────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public UserDashboardStatsDto getHrStats(Long userId) {

        Company company = companyRepository.findByUserId(userId)
                .orElse(null);

        if (company == null) {
            // HR registered but no company profile yet
            return UserDashboardStatsDto.builder()
                    .role("HR")
                    .activeJobs(0L)
                    .totalApplications(0L)
                    .pendingReview(0L)
                    .hired(0L)
                    .build();
        }

        Long companyId = company.getId();
        long activeJobs       = jobRepository.countByCompanyIdAndStatus(companyId, "OPEN");
        long totalApplications = applicationRepository.countByCompanyId(companyId);
        long pendingReview    = applicationRepository.countByCompanyIdAndStatus(companyId, "APPLIED");
        long hired            = applicationRepository.countByCompanyIdAndStatus(companyId, "HIRED");

        return UserDashboardStatsDto.builder()
                .role("HR")
                .activeJobs(activeJobs)
                .totalApplications(totalApplications)
                .pendingReview(pendingReview)
                .hired(hired)
                .build();
    }
}
