package com.recruitment.backend.dto.jobseeker;

import lombok.Builder;
import lombok.Getter;

import java.time.OffsetDateTime;

@Getter
@Builder
public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String status;
    private String coverLetter;
    private OffsetDateTime appliedAt;
    private OffsetDateTime updatedAt;
}
