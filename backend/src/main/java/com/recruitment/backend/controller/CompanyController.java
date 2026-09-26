package com.recruitment.backend.controller;

import com.recruitment.backend.dto.common.ApiResponse;
import com.recruitment.backend.dto.company.*;
import com.recruitment.backend.entity.Application;
import com.recruitment.backend.entity.Company;
import com.recruitment.backend.entity.Job;
import com.recruitment.backend.entity.Interview;
import com.recruitment.backend.entity.ApplicationStatusHistory;
import com.recruitment.backend.entity.User;
import com.recruitment.backend.repository.ApplicationRepository;
import com.recruitment.backend.repository.CompanyRepository;
import com.recruitment.backend.repository.JobRepository;
import com.recruitment.backend.repository.UserRepository;
import com.recruitment.backend.repository.InterviewRepository;
import com.recruitment.backend.repository.ApplicationStatusHistoryRepository;
import com.recruitment.backend.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
@PreAuthorize("hasRole('HR')")
public class CompanyController {
    private static final Set<String> JOB_STATUSES = Set.of("DRAFT", "OPEN", "PUBLISHED", "CLOSED");
    private static final Set<String> APPLICATION_STATUSES = Set.of("APPLIED", "REVIEWING", "SHORTLISTED", "REJECTED", "HIRED");

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final NotificationService notificationService;
    private final ApplicationStatusHistoryRepository applicationStatusHistoryRepository;

    @GetMapping("/dashboard")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<CompanyDashboardResponse>> dashboard(@AuthenticationPrincipal UserDetails details) {
        Company company = getCompany(details);
        long totalJobs = jobRepository.findByCompanyId(company.getId()).size();
        return ResponseEntity.ok(ApiResponse.ok("Company dashboard retrieved successfully", CompanyDashboardResponse.builder()
                .company(toProfile(company))
                .totalJobs(totalJobs)
                .activeJobs(jobRepository.countByCompanyIdAndStatus(company.getId(), "OPEN"))
                .totalApplications(applicationRepository.countByCompanyId(company.getId()))
                .shortlistedApplications(applicationRepository.countByCompanyIdAndStatus(company.getId(), "SHORTLISTED"))
                .build()));
    }

    @GetMapping("/profile")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<CompanyProfileResponse>> getProfile(@AuthenticationPrincipal UserDetails details) {
        return ResponseEntity.ok(ApiResponse.ok("Company profile retrieved successfully", toProfile(getCompany(details))));
    }

    @PutMapping("/profile")
    @Transactional
    public ResponseEntity<ApiResponse<CompanyProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails details,
            @Valid @RequestBody UpdateCompanyProfileRequest request) {
        Company company = getCompany(details);
        company.setCompanyName(request.getCompanyName().trim());
        company.setDescription(request.getDescription());
        company.setIndustry(request.getIndustry());
        company.setWebsite(request.getWebsite());
        company.setLogoUrl(request.getLogoUrl());
        company.setAddress(request.getAddress());
        company.setCity(request.getCity());
        company.setCountry(request.getCountry());
        company.setCompanySize(request.getCompanySize());
        return ResponseEntity.ok(ApiResponse.ok("Company profile updated successfully", toProfile(company)));
    }

    @GetMapping("/jobs")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<CompanyJobResponse>>> getJobs(@AuthenticationPrincipal UserDetails details) {
        Company company = getCompany(details);
        return ResponseEntity.ok(ApiResponse.ok("Company jobs retrieved successfully",
                jobRepository.findByCompanyId(company.getId()).stream().map(this::toJob).toList()));
    }

    @PostMapping("/jobs")
    @Transactional
    public ResponseEntity<ApiResponse<CompanyJobResponse>> createJob(
            @AuthenticationPrincipal UserDetails details,
            @Valid @RequestBody CreateCompanyJobRequest request) {
        Company company = getCompany(details);
        String status = normalizeStatus(request.getStatus(), "DRAFT");
        Job job = jobRepository.save(Job.builder()
                .company(company)
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .responsibilities(request.getResponsibilities())
                .requirements(request.getRequirements())
                .location(request.getLocation())
                .employmentType(request.getEmploymentType())
                .experienceLevel(request.getExperienceLevel())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .applicationDeadline(request.getApplicationDeadline())
                .status(status)
                .build());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Job created successfully", toJob(job)));
    }

    @PutMapping("/jobs/{jobId}")
    @Transactional
    public ResponseEntity<ApiResponse<CompanyJobResponse>> updateJob(
            @AuthenticationPrincipal UserDetails details,
            @PathVariable Long jobId,
            @Valid @RequestBody CreateCompanyJobRequest request) {
        Job job = getOwnedJob(details, jobId);
        job.setTitle(request.getTitle().trim());
        job.setDescription(request.getDescription());
        job.setResponsibilities(request.getResponsibilities());
        job.setRequirements(request.getRequirements());
        job.setLocation(request.getLocation());
        job.setEmploymentType(request.getEmploymentType());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setApplicationDeadline(request.getApplicationDeadline());
        job.setStatus(normalizeStatus(request.getStatus(), job.getStatus()));
        return ResponseEntity.ok(ApiResponse.ok("Job updated successfully", toJob(job)));
    }

    @PutMapping("/jobs/{jobId}/status")
    @Transactional
    public ResponseEntity<ApiResponse<CompanyJobResponse>> updateJobStatus(
            @AuthenticationPrincipal UserDetails details,
            @PathVariable Long jobId,
            @RequestParam String status) {
        Job job = getOwnedJob(details, jobId);
        job.setStatus(normalizeStatus(status, job.getStatus()));
        return ResponseEntity.ok(ApiResponse.ok("Job status updated successfully", toJob(job)));
    }

    @GetMapping("/applications")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<CompanyApplicationResponse>>> getApplications(
            @AuthenticationPrincipal UserDetails details) {
        Company company = getCompany(details);
        List<CompanyApplicationResponse> applications = applicationRepository.findAll().stream()
                .filter(application -> application.getJob().getCompany().getId().equals(company.getId()))
                .map(this::toApplication)
                .toList();
        return ResponseEntity.ok(ApiResponse.ok("Company applications retrieved successfully", applications));
    }

    @PutMapping("/applications/{applicationId}/status")
    @Transactional
    public ResponseEntity<ApiResponse<CompanyApplicationResponse>> updateApplicationStatus(
            @AuthenticationPrincipal UserDetails details,
            @PathVariable Long applicationId,
            @Valid @RequestBody UpdateApplicationStatusRequest request) {
        Company company = getCompany(details);
        Application application = applicationRepository.findById(applicationId)
                .filter(item -> item.getJob().getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));
        if (!APPLICATION_STATUSES.contains(request.getStatus().toUpperCase())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Unsupported application status"));
        }
        String oldStatus = application.getStatus();
        application.setStatus(request.getStatus().toUpperCase());
        if (!oldStatus.equals(application.getStatus())) {
            applicationStatusHistoryRepository.save(ApplicationStatusHistory.builder()
                    .application(application)
                    .oldStatus(oldStatus)
                    .newStatus(application.getStatus())
                    .changedBy(getCompanyUser(details))
                    .build());
        }
        notificationService.create(application.getJobSeeker().getUser(), "APPLICATION_STATUS",
                "Application status updated",
                "Your application for " + application.getJob().getTitle() + " is now " + application.getStatus() + ".");
        return ResponseEntity.ok(ApiResponse.ok("Application status updated successfully", toApplication(application)));
    }

    @GetMapping("/interviews")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<CompanyInterviewResponse>>> getInterviews(
            @AuthenticationPrincipal UserDetails details) {
        Company company = getCompany(details);
        List<CompanyInterviewResponse> interviews = interviewRepository.findAll().stream()
                .filter(interview -> interview.getApplication().getJob().getCompany().getId().equals(company.getId()))
                .map(this::toInterview)
                .toList();
        return ResponseEntity.ok(ApiResponse.ok("Company interviews retrieved successfully", interviews));
    }

    @PostMapping("/applications/{applicationId}/interviews")
    @Transactional
    public ResponseEntity<ApiResponse<CompanyInterviewResponse>> scheduleInterview(
            @AuthenticationPrincipal UserDetails details,
            @PathVariable Long applicationId,
            @Valid @RequestBody ScheduleInterviewRequest request) {
        Company company = getCompany(details);
        Application application = applicationRepository.findById(applicationId)
                .filter(item -> item.getJob().getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));
        Interview interview = interviewRepository.save(Interview.builder()
                .application(application)
                .interviewer(getCompanyUser(details))
                .interviewType("VIDEO".equals(request.getInterviewType()) ? "ONLINE" : request.getInterviewType())
                .scheduledAt(request.getScheduledAt())
                .durationMinutes(request.getDurationMinutes())
                .location(request.getLocation())
                .meetingLink(request.getMeetingLink())
                .notes(request.getNotes())
                .status("SCHEDULED")
                .build());
        notificationService.create(application.getJobSeeker().getUser(), "INTERVIEW_SCHEDULED",
                "Interview scheduled",
                "An interview for " + application.getJob().getTitle() + " has been scheduled.");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Interview scheduled successfully", toInterview(interview)));
    }

    @PutMapping("/interviews/{interviewId}/status")
    @Transactional
    public ResponseEntity<ApiResponse<CompanyInterviewResponse>> updateInterviewStatus(
            @AuthenticationPrincipal UserDetails details,
            @PathVariable Long interviewId,
            @RequestParam String status) {
        Company company = getCompany(details);
        Interview interview = interviewRepository.findById(interviewId)
                .filter(item -> item.getApplication().getJob().getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new IllegalArgumentException("Interview not found"));
        if (!Set.of("SCHEDULED", "ACCEPTED", "DECLINED", "COMPLETED", "CANCELLED", "RESCHEDULED").contains(status.toUpperCase())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Unsupported interview status"));
        }
        interview.setStatus(status.toUpperCase());
        notificationService.create(interview.getApplication().getJobSeeker().getUser(), "INTERVIEW_STATUS",
                "Interview status updated",
                "Your interview for " + interview.getApplication().getJob().getTitle() + " is now " + interview.getStatus() + ".");
        return ResponseEntity.ok(ApiResponse.ok("Interview status updated successfully", toInterview(interview)));
    }

    private Company getCompany(UserDetails details) {
        User user = userRepository.findByEmail(details.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Company profile not found"));
    }

    private User getCompanyUser(UserDetails details) {
        return userRepository.findByEmail(details.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private Job getOwnedJob(UserDetails details, Long jobId) {
        Company company = getCompany(details);
        return jobRepository.findById(jobId)
                .filter(job -> job.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
    }

    private String normalizeStatus(String status, String fallback) {
        String normalized = status == null || status.isBlank() ? fallback : status.toUpperCase();
        if (!JOB_STATUSES.contains(normalized)) {
            throw new IllegalArgumentException("Unsupported job status");
        }
        return normalized;
    }

    private CompanyProfileResponse toProfile(Company company) {
        return CompanyProfileResponse.builder().id(company.getId()).companyName(company.getCompanyName())
                .description(company.getDescription()).industry(company.getIndustry()).website(company.getWebsite())
                .logoUrl(company.getLogoUrl()).address(company.getAddress()).city(company.getCity())
                .country(company.getCountry()).companySize(company.getCompanySize())
                .verificationStatus(company.getVerificationStatus()).build();
    }

    private CompanyJobResponse toJob(Job job) {
        return CompanyJobResponse.builder().id(job.getId()).title(job.getTitle()).description(job.getDescription())
                .responsibilities(job.getResponsibilities()).requirements(job.getRequirements()).location(job.getLocation())
                .employmentType(job.getEmploymentType()).experienceLevel(job.getExperienceLevel()).salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax()).applicationDeadline(job.getApplicationDeadline()).status(job.getStatus())
                .applicationCount(applicationRepository.countByJobId(job.getId())).createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt()).build();
    }

    private CompanyApplicationResponse toApplication(Application application) {
        User applicant = application.getJobSeeker().getUser();
        var resume = application.getResume();
        return CompanyApplicationResponse.builder().id(application.getId()).jobId(application.getJob().getId())
                .jobTitle(application.getJob().getTitle()).jobSeekerId(application.getJobSeeker().getId())
                .applicantName(applicant.getFirstName() + " " + applicant.getLastName()).applicantEmail(applicant.getEmail())
                .status(application.getStatus()).coverLetter(application.getCoverLetter())
                .resumeId(resume == null ? null : resume.getId())
                .resumeFileName(resume == null ? null : resume.getFileName())
                .resumeFileUrl(resume == null ? null : "/api/resumes/" + resume.getId())
                .resumeFileType(resume == null ? null : resume.getFileType())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt()).build();
    }

    private CompanyInterviewResponse toInterview(Interview interview) {
        User applicant = interview.getApplication().getJobSeeker().getUser();
        return CompanyInterviewResponse.builder().id(interview.getId())
                .applicationId(interview.getApplication().getId())
                .applicantName(applicant.getFirstName() + " " + applicant.getLastName())
                .applicantEmail(applicant.getEmail())
                .jobTitle(interview.getApplication().getJob().getTitle())
                .interviewType(interview.getInterviewType())
                .scheduledAt(interview.getScheduledAt())
                .durationMinutes(interview.getDurationMinutes())
                .location(interview.getLocation())
                .meetingLink(interview.getMeetingLink())
                .status(interview.getStatus())
                .notes(interview.getNotes())
                .build();
    }
}
