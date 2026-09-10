package com.recruitment.backend.controller;

import com.recruitment.backend.dto.common.ApiResponse;
import com.recruitment.backend.dto.jobseeker.*;
import com.recruitment.backend.entity.*;
import com.recruitment.backend.repository.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-seeker")
@RequiredArgsConstructor
@PreAuthorize("hasRole('JOB_SEEKER')")
public class JobSeekerController {

    private final UserRepository userRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;
    private final ResumeRepository resumeRepository;

    @GetMapping("/profile")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<JobSeekerProfileResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        JobSeeker seeker = getSeeker(userDetails);
        return ResponseEntity.ok(ApiResponse.ok("Profile retrieved successfully", toProfile(seeker)));
    }

    @PutMapping("/profile")
    @Transactional
    public ResponseEntity<ApiResponse<JobSeekerProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateJobSeekerProfileRequest request) {
        JobSeeker seeker = getSeeker(userDetails);
        seeker.setDateOfBirth(request.getDateOfBirth());
        seeker.setGender(request.getGender());
        seeker.setHeadline(request.getHeadline());
        seeker.setBio(request.getBio());
        seeker.setLocation(request.getLocation());
        seeker.setYearsOfExperience(request.getYearsOfExperience());
        seeker.setProfileImageUrl(request.getProfileImageUrl());
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", toProfile(seeker)));
    }

    @GetMapping("/applications")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getApplications(
            @AuthenticationPrincipal UserDetails userDetails) {
        JobSeeker seeker = getSeeker(userDetails);
        List<ApplicationResponse> applications = applicationRepository.findByJobSeekerId(seeker.getId())
                .stream()
                .map(this::toApplication)
                .toList();
        return ResponseEntity.ok(ApiResponse.ok("Applications retrieved successfully", applications));
    }

    @PostMapping("/jobs/{jobId}/applications")
    @Transactional
    public ResponseEntity<ApiResponse<ApplicationResponse>> apply(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long jobId,
            @Valid @RequestBody ApplyJobRequest request) {
        JobSeeker seeker = getSeeker(userDetails);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
        if (!"OPEN".equals(job.getStatus()) && !"PUBLISHED".equals(job.getStatus())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error("This job is no longer accepting applications"));
        }
        if (applicationRepository.existsByJobIdAndJobSeekerId(jobId, seeker.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error("You have already applied for this job"));
        }

        Resume resume = request.getResumeId() == null ? null : resumeRepository.findById(request.getResumeId())
                .filter(item -> item.getJobSeeker().getId().equals(seeker.getId()))
                .orElseThrow(() -> new IllegalArgumentException("Resume not found"));

        Application application = applicationRepository.save(Application.builder()
                .job(job)
                .jobSeeker(seeker)
                .resume(resume)
                .coverLetter(request.getCoverLetter())
                .status("APPLIED")
                .build());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Application submitted successfully", toApplication(application)));
    }

    @GetMapping("/saved-jobs")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<Long>>> getSavedJobs(
            @AuthenticationPrincipal UserDetails userDetails) {
        JobSeeker seeker = getSeeker(userDetails);
        List<Long> jobIds = savedJobRepository.findByJobSeekerId(seeker.getId()).stream()
                .map(savedJob -> savedJob.getJob().getId())
                .toList();
        return ResponseEntity.ok(ApiResponse.ok("Saved jobs retrieved successfully", jobIds));
    }

    @PutMapping("/jobs/{jobId}/saved")
    @Transactional
    public ResponseEntity<ApiResponse<Boolean>> saveJob(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long jobId) {
        JobSeeker seeker = getSeeker(userDetails);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
        if (savedJobRepository.existsByJobSeekerIdAndJobId(seeker.getId(), jobId)) {
            savedJobRepository.deleteByJobSeekerIdAndJobId(seeker.getId(), jobId);
            return ResponseEntity.ok(ApiResponse.ok("Job removed from saved jobs", false));
        }
        savedJobRepository.save(SavedJob.builder().jobSeeker(seeker).job(job).build());
        return ResponseEntity.ok(ApiResponse.ok("Job saved successfully", true));
    }

    private JobSeeker getSeeker(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return jobSeekerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Job seeker profile not found"));
    }

    private JobSeekerProfileResponse toProfile(JobSeeker seeker) {
        User user = seeker.getUser();
        return JobSeekerProfileResponse.builder()
                .id(seeker.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .dateOfBirth(seeker.getDateOfBirth())
                .gender(seeker.getGender())
                .headline(seeker.getHeadline())
                .bio(seeker.getBio())
                .location(seeker.getLocation())
                .yearsOfExperience(seeker.getYearsOfExperience())
                .profileImageUrl(seeker.getProfileImageUrl())
                .build();
    }

    private ApplicationResponse toApplication(Application application) {
        return ApplicationResponse.builder()
                .id(application.getId())
                .jobId(application.getJob().getId())
                .jobTitle(application.getJob().getTitle())
                .companyName(application.getJob().getCompany().getCompanyName())
                .status(application.getStatus())
                .coverLetter(application.getCoverLetter())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}
