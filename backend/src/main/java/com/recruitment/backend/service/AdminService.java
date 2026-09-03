package com.recruitment.backend.service;

import com.recruitment.backend.dto.admin.CompanySummaryDto;
import com.recruitment.backend.dto.admin.DashboardStatsDto;
import com.recruitment.backend.dto.admin.JobSummaryDto;
import com.recruitment.backend.dto.admin.UserSummaryDto;
import com.recruitment.backend.entity.Company;
import com.recruitment.backend.entity.Job;
import com.recruitment.backend.entity.User;
import com.recruitment.backend.repository.ApplicationRepository;
import com.recruitment.backend.repository.CompanyRepository;
import com.recruitment.backend.repository.JobRepository;
import com.recruitment.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    // ─── Dashboard Stats ──────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        long totalUsers       = userRepository.count();
        long totalJobSeekers  = userRepository.findByRoleName("JOB_SEEKER").size();
        long totalHr          = userRepository.findByRoleName("HR").size();
        long totalAdmins      = userRepository.findByRoleName("ADMIN").size();

        long totalCompanies   = companyRepository.count();
        long pendingCompanies = companyRepository.findByVerificationStatus("PENDING").size();
        long approvedCompanies = companyRepository.findByVerificationStatus("APPROVED").size();
        long rejectedCompanies = companyRepository.findByVerificationStatus("REJECTED").size();

        long totalJobs   = jobRepository.count();
        long activeJobs  = jobRepository.findByStatus("OPEN").size();
        long draftJobs   = jobRepository.findByStatus("DRAFT").size();
        long closedJobs  = jobRepository.findByStatus("CLOSED").size();

        long totalApplications = applicationRepository.count();

        return DashboardStatsDto.builder()
                .totalUsers(totalUsers)
                .totalJobSeekers(totalJobSeekers)
                .totalHrUsers(totalHr)
                .totalAdmins(totalAdmins)
                .totalCompanies(totalCompanies)
                .pendingCompanies(pendingCompanies)
                .approvedCompanies(approvedCompanies)
                .rejectedCompanies(rejectedCompanies)
                .totalJobs(totalJobs)
                .activeJobs(activeJobs)
                .draftJobs(draftJobs)
                .closedJobs(closedJobs)
                .totalApplications(totalApplications)
                .build();
    }

    // ─── User Management ──────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<UserSummaryDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserSummaryDto> getUsersByRole(String roleName) {
        return userRepository.findByRoleName(roleName.toUpperCase()).stream()
                .map(this::toUserSummary)
                .toList();
    }

    @Transactional
    public UserSummaryDto updateUserStatus(Long userId, String newStatus) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        String status = newStatus.toUpperCase();
        if (!status.equals("ACTIVE") && !status.equals("SUSPENDED") && !status.equals("INACTIVE")) {
            throw new IllegalArgumentException("Invalid status. Allowed: ACTIVE, SUSPENDED, INACTIVE");
        }

        user.setStatus(status);
        return toUserSummary(userRepository.save(user));
    }

    // ─── Company Verification ─────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<CompanySummaryDto> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(this::toCompanySummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CompanySummaryDto> getCompaniesByStatus(String status) {
        return companyRepository.findByVerificationStatus(status.toUpperCase()).stream()
                .map(this::toCompanySummary)
                .toList();
    }

    @Transactional
    public CompanySummaryDto updateCompanyVerification(Long companyId, String newStatus) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found: " + companyId));

        String status = newStatus.toUpperCase();
        if (!status.equals("APPROVED") && !status.equals("REJECTED") && !status.equals("PENDING")) {
            throw new IllegalArgumentException("Invalid status. Allowed: PENDING, APPROVED, REJECTED");
        }

        company.setVerificationStatus(status);
        return toCompanySummary(companyRepository.save(company));
    }

    // ─── Job Management ───────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<JobSummaryDto> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(this::toJobSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<JobSummaryDto> getJobsByStatus(String status) {
        return jobRepository.findByStatus(status.toUpperCase()).stream()
                .map(this::toJobSummary)
                .toList();
    }

    @Transactional
    public JobSummaryDto updateJobStatus(Long jobId, String newStatus) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found: " + jobId));

        String status = newStatus.toUpperCase();
        if (!status.equals("OPEN") && !status.equals("CLOSED") && !status.equals("DRAFT")) {
            throw new IllegalArgumentException("Invalid status. Allowed: DRAFT, OPEN, CLOSED");
        }

        job.setStatus(status);
        return toJobSummary(jobRepository.save(job));
    }

    @Transactional
    public void deleteJob(Long jobId) {
        if (!jobRepository.existsById(jobId)) {
            throw new IllegalArgumentException("Job not found: " + jobId);
        }
        jobRepository.deleteById(jobId);
    }

    // ─── Mappers ──────────────────────────────────────────────────────────────
    private UserSummaryDto toUserSummary(User user) {
        return UserSummaryDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole() != null ? user.getRole().getName() : null)
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private CompanySummaryDto toCompanySummary(Company company) {
        User recruiter = company.getUser();
        return CompanySummaryDto.builder()
                .id(company.getId())
                .userId(recruiter != null ? recruiter.getId() : null)
                .recruiterName(recruiter != null
                        ? recruiter.getFirstName() + " " + recruiter.getLastName()
                        : null)
                .recruiterEmail(recruiter != null ? recruiter.getEmail() : null)
                .companyName(company.getCompanyName())
                .industry(company.getIndustry())
                .website(company.getWebsite())
                .city(company.getCity())
                .country(company.getCountry())
                .companySize(company.getCompanySize())
                .verificationStatus(company.getVerificationStatus())
                .createdAt(company.getCreatedAt())
                .build();
    }

    private JobSummaryDto toJobSummary(Job job) {
        return JobSummaryDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .companyName(job.getCompany() != null ? job.getCompany().getCompanyName() : null)
                .location(job.getLocation())
                .employmentType(job.getEmploymentType())
                .experienceLevel(job.getExperienceLevel())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .build();
    }
}
