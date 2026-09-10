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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/job-seeker")
@RequiredArgsConstructor
@PreAuthorize("hasRole('JOB_SEEKER')")
public class JobSeekerController {
    private static final long MAX_RESUME_SIZE = 5 * 1024 * 1024;
    private static final Path RESUME_DIRECTORY = Paths.get("uploads", "resumes").toAbsolutePath().normalize();

    private final UserRepository userRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;
    private final ResumeRepository resumeRepository;

    @GetMapping("/resumes")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<ResumeResponse>>> getResumes(
            @AuthenticationPrincipal UserDetails userDetails) {
        JobSeeker seeker = getSeeker(userDetails);
        return ResponseEntity.ok(ApiResponse.ok("Resumes retrieved successfully",
                resumeRepository.findByJobSeekerId(seeker.getId()).stream().map(this::toResume).toList()));
    }

    @PostMapping(value = "/resumes", consumes = "multipart/form-data")
    @Transactional
    public ResponseEntity<ApiResponse<ResumeResponse>> uploadResume(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {
        JobSeeker seeker = getSeeker(userDetails);
        validateResume(file);
        try {
            Files.createDirectories(RESUME_DIRECTORY);
            String originalName = file.getOriginalFilename() == null ? "resume" : file.getOriginalFilename();
            String storedName = UUID.randomUUID() + "-" + sanitizeFilename(originalName);
            Path target = RESUME_DIRECTORY.resolve(storedName).normalize();
            if (!target.startsWith(RESUME_DIRECTORY)) {
                throw new IllegalArgumentException("Invalid resume filename");
            }
            Files.copy(file.getInputStream(), target);
            Resume resume = resumeRepository.save(Resume.builder()
                    .jobSeeker(seeker)
                    .fileName(originalName)
                    .fileUrl(Paths.get("uploads", "resumes", storedName).toString())
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .isDefault(resumeRepository.countByJobSeekerId(seeker.getId()) == 0)
                    .build());
            resume.setFileUrl("/api/resumes/" + resume.getId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok("Resume uploaded successfully", toResume(resume)));
        } catch (IOException exception) {
            throw new IllegalStateException("Resume could not be stored", exception);
        }
    }

    @DeleteMapping("/resumes/{resumeId}")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteResume(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long resumeId) {
        JobSeeker seeker = getSeeker(userDetails);
        Resume resume = resumeRepository.findById(resumeId)
                .filter(item -> item.getJobSeeker().getId().equals(seeker.getId()))
                .orElseThrow(() -> new IllegalArgumentException("Resume not found"));
        try {
            Files.deleteIfExists(Paths.get(resume.getFileUrl()));
        } catch (IOException exception) {
            throw new IllegalStateException("Resume file could not be deleted", exception);
        }
        resumeRepository.delete(resume);
        return ResponseEntity.ok(ApiResponse.ok("Resume deleted successfully", null));
    }

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

    private ResumeResponse toResume(Resume resume) {
        return ResumeResponse.builder().id(resume.getId()).fileName(resume.getFileName())
                .fileUrl("/api/resumes/" + resume.getId()).fileType(resume.getFileType()).fileSize(resume.getFileSize())
                .isDefault(resume.getIsDefault()).uploadedAt(resume.getUploadedAt()).build();
    }

    private void validateResume(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Choose a resume file to upload");
        }
        if (file.getSize() > MAX_RESUME_SIZE) {
            throw new IllegalArgumentException("Resume must be 5 MB or smaller");
        }
        String fileName = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase();
        if (!fileName.endsWith(".pdf") && !fileName.endsWith(".doc") && !fileName.endsWith(".docx")) {
            throw new IllegalArgumentException("Only PDF, DOC, and DOCX resumes are supported");
        }
    }

    private String sanitizeFilename(String fileName) {
        return fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
