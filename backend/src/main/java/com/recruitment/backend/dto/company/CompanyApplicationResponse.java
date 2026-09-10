package com.recruitment.backend.dto.company;

import lombok.Builder;
import lombok.Getter;

import java.time.OffsetDateTime;

@Getter
@Builder
public class CompanyApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private Long jobSeekerId;
    private String applicantName;
    private String applicantEmail;
    private String status;
    private String coverLetter;
    private OffsetDateTime appliedAt;
    private OffsetDateTime updatedAt;
}
