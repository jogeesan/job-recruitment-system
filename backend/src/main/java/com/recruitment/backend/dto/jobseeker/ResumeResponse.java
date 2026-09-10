package com.recruitment.backend.dto.jobseeker;

import lombok.Builder;
import lombok.Getter;

import java.time.OffsetDateTime;

@Getter
@Builder
public class ResumeResponse {
    private Long id;
    private String fileName;
    private String fileUrl;
    private String fileType;
    private Long fileSize;
    private Boolean isDefault;
    private OffsetDateTime uploadedAt;
}
