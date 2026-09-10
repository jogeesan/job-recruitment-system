package com.recruitment.backend.controller;

import com.recruitment.backend.dto.admin.*;
import com.recruitment.backend.dto.common.ApiResponse;
import com.recruitment.backend.entity.*;
import com.recruitment.backend.repository.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private static final Set<String> USER_STATUSES = Set.of("ACTIVE", "SUSPENDED", "INACTIVE");
    private static final Set<String> COMPANY_STATUSES = Set.of("PENDING", "VERIFIED", "REJECTED");
    private static final Set<String> JOB_STATUSES = Set.of("DRAFT", "OPEN", "PUBLISHED", "CLOSED");

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final SkillRepository skillRepository;

    @GetMapping("/dashboard")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> dashboard() {
        return ResponseEntity.ok(ApiResponse.ok("Admin dashboard retrieved successfully", AdminDashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalJobSeekers(userRepository.findByRoleName("JOB_SEEKER").size())
                .totalHrUsers(userRepository.findByRoleName("HR").size())
                .totalCompanies(companyRepository.count())
                .pendingCompanies(companyRepository.findByVerificationStatus("PENDING").size())
                .totalJobs(jobRepository.count())
                .activeJobs(jobRepository.countByStatus("OPEN"))
                .totalApplications(applicationRepository.count())
                .build()));
    }

    @GetMapping("/users")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> users() {
        return ResponseEntity.ok(ApiResponse.ok("Users retrieved successfully", userRepository.findAll().stream()
                .map(user -> AdminUserResponse.builder().id(user.getId()).firstName(user.getFirstName())
                        .lastName(user.getLastName()).email(user.getEmail()).role(user.getRole().getName())
                        .status(user.getStatus()).createdAt(user.getCreatedAt()).build()).toList()));
    }

    @PutMapping("/users/{userId}/status")
    @Transactional
    public ResponseEntity<ApiResponse<AdminUserResponse>> updateUserStatus(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateAdminStatusRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        String status = request.getStatus().toUpperCase();
        if (!USER_STATUSES.contains(status)) return ResponseEntity.badRequest().body(ApiResponse.error("Unsupported user status"));
        user.setStatus(status);
        return ResponseEntity.ok(ApiResponse.ok("User status updated successfully", AdminUserResponse.builder()
                .id(user.getId()).firstName(user.getFirstName()).lastName(user.getLastName()).email(user.getEmail())
                .role(user.getRole().getName()).status(user.getStatus()).createdAt(user.getCreatedAt()).build()));
    }

    @GetMapping("/companies")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<AdminCompanyResponse>>> companies() {
        return ResponseEntity.ok(ApiResponse.ok("Companies retrieved successfully", companyRepository.findAll().stream()
                .map(company -> AdminCompanyResponse.builder().id(company.getId()).companyName(company.getCompanyName())
                        .ownerName(company.getUser().getFirstName() + " " + company.getUser().getLastName())
                        .ownerEmail(company.getUser().getEmail()).industry(company.getIndustry()).city(company.getCity())
                        .country(company.getCountry()).verificationStatus(company.getVerificationStatus())
                        .jobCount(jobRepository.findByCompanyId(company.getId()).size()).build()).toList()));
    }

    @PutMapping("/companies/{companyId}/verification")
    @Transactional
    public ResponseEntity<ApiResponse<AdminCompanyResponse>> verifyCompany(
            @PathVariable Long companyId,
            @RequestParam String status) {
        Company company = companyRepository.findById(companyId).orElseThrow(() -> new IllegalArgumentException("Company not found"));
        String normalized = status.toUpperCase();
        if (!COMPANY_STATUSES.contains(normalized)) return ResponseEntity.badRequest().body(ApiResponse.error("Unsupported verification status"));
        company.setVerificationStatus(normalized);
        return ResponseEntity.ok(ApiResponse.ok("Company verification updated successfully", toCompany(company)));
    }

    @GetMapping("/jobs")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<AdminJobResponse>>> jobs() {
        return ResponseEntity.ok(ApiResponse.ok("Jobs retrieved successfully", jobRepository.findAll().stream()
                .map(job -> AdminJobResponse.builder().id(job.getId()).title(job.getTitle())
                        .companyName(job.getCompany().getCompanyName()).location(job.getLocation())
                        .employmentType(job.getEmploymentType()).status(job.getStatus())
                        .applicationCount(applicationRepository.countByJobId(job.getId())).createdAt(job.getCreatedAt()).build()).toList()));
    }

    @PutMapping("/jobs/{jobId}/status")
    @Transactional
    public ResponseEntity<ApiResponse<AdminJobResponse>> updateJobStatus(
            @PathVariable Long jobId,
            @RequestParam String status) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new IllegalArgumentException("Job not found"));
        String normalized = status.toUpperCase();
        if (!JOB_STATUSES.contains(normalized)) return ResponseEntity.badRequest().body(ApiResponse.error("Unsupported job status"));
        job.setStatus(normalized);
        return ResponseEntity.ok(ApiResponse.ok("Job status updated successfully", toJob(job)));
    }

    @GetMapping("/applications")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<AdminApplicationResponse>>> applications() {
        return ResponseEntity.ok(ApiResponse.ok("Applications retrieved successfully", applicationRepository.findAll().stream()
                .map(application -> AdminApplicationResponse.builder().id(application.getId())
                        .jobTitle(application.getJob().getTitle()).companyName(application.getJob().getCompany().getCompanyName())
                        .applicantName(application.getJobSeeker().getUser().getFirstName() + " " + application.getJobSeeker().getUser().getLastName())
                        .applicantEmail(application.getJobSeeker().getUser().getEmail()).status(application.getStatus())
                        .appliedAt(application.getAppliedAt()).build()).toList()));
    }

    @GetMapping("/skills")
    public ResponseEntity<ApiResponse<List<Skill>>> skills() {
        return ResponseEntity.ok(ApiResponse.ok("Skills retrieved successfully", skillRepository.findAll()));
    }

    @PostMapping("/skills")
    @Transactional
    public ResponseEntity<ApiResponse<Skill>> createSkill(@Valid @RequestBody CreateSkillRequest request) {
        String name = request.getName().trim();
        if (skillRepository.existsByName(name)) return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.error("Skill already exists"));
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Skill created successfully", skillRepository.save(Skill.builder().name(name).build())));
    }

    @DeleteMapping("/skills/{skillId}")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteSkill(@PathVariable Long skillId) {
        if (!skillRepository.existsById(skillId)) return ResponseEntity.notFound().build();
        skillRepository.deleteById(skillId);
        return ResponseEntity.ok(ApiResponse.ok("Skill deleted successfully", null));
    }

    private AdminCompanyResponse toCompany(Company company) {
        return AdminCompanyResponse.builder().id(company.getId()).companyName(company.getCompanyName())
                .ownerName(company.getUser().getFirstName() + " " + company.getUser().getLastName())
                .ownerEmail(company.getUser().getEmail()).industry(company.getIndustry()).city(company.getCity())
                .country(company.getCountry()).verificationStatus(company.getVerificationStatus())
                .jobCount(jobRepository.findByCompanyId(company.getId()).size()).build();
    }

    private AdminJobResponse toJob(Job job) {
        return AdminJobResponse.builder().id(job.getId()).title(job.getTitle()).companyName(job.getCompany().getCompanyName())
                .location(job.getLocation()).employmentType(job.getEmploymentType()).status(job.getStatus())
                .applicationCount(applicationRepository.countByJobId(job.getId())).createdAt(job.getCreatedAt()).build();
    }
}
