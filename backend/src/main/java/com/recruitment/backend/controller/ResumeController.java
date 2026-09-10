package com.recruitment.backend.controller;

import com.recruitment.backend.entity.Application;
import com.recruitment.backend.entity.Resume;
import com.recruitment.backend.entity.User;
import com.recruitment.backend.repository.ApplicationRepository;
import com.recruitment.backend.repository.ResumeRepository;
import com.recruitment.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {
    private final ResumeRepository resumeRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    @GetMapping("/{resumeId}")
    public ResponseEntity<Resource> download(
            @AuthenticationPrincipal UserDetails details,
            @PathVariable Long resumeId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found"));
        User user = userRepository.findByEmail(details.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        boolean isOwner = resume.getJobSeeker().getUser().getId().equals(user.getId());
        boolean isCompanyApplicant = applicationRepository.findByJobSeekerId(resume.getJobSeeker().getId()).stream()
                .anyMatch(application -> application.getJob().getCompany().getUser().getId().equals(user.getId()));
        if (!isOwner && !isCompanyApplicant) {
            return ResponseEntity.status(403).build();
        }

        try {
            Path file = Paths.get(resume.getFileUrl()).toAbsolutePath().normalize();
            Path allowedDirectory = Paths.get("uploads", "resumes").toAbsolutePath().normalize();
            if (!file.startsWith(allowedDirectory)) {
                return ResponseEntity.status(403).build();
            }
            Resource resource = new UrlResource(file.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }
            MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
            if (resume.getFileType() != null) {
                try {
                    mediaType = MediaType.parseMediaType(resume.getFileType());
                } catch (IllegalArgumentException ignored) {
                    // Keep the safe binary fallback for unknown persisted types.
                }
            }
            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resume.getFileName() + "\"")
                    .body(resource);
        } catch (IOException exception) {
            throw new IllegalStateException("Resume file could not be read", exception);
        }
    }
}
