package com.recruitment.backend.controller;

import com.recruitment.backend.dto.common.ApiResponse;
import com.recruitment.backend.dto.job.JobSummaryResponse;
import com.recruitment.backend.entity.Job;
import com.recruitment.backend.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobRepository jobRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<JobSummaryResponse>>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String employmentType) {
        List<JobSummaryResponse> jobs = jobRepository
                .searchJobs(normalize(keyword), normalize(location), normalize(employmentType))
                .stream()
                .map(this::toSummary)
                .toList();

        return ResponseEntity.ok(ApiResponse.ok("Jobs retrieved successfully", jobs));
    }

    private JobSummaryResponse toSummary(Job job) {
        return JobSummaryResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .companyName(job.getCompany() != null ? job.getCompany().getCompanyName() : null)
                .location(job.getLocation())
                .employmentType(job.getEmploymentType())
                .experienceLevel(job.getExperienceLevel())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .applicationDeadline(job.getApplicationDeadline())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .build();
    }

    private String normalize(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
