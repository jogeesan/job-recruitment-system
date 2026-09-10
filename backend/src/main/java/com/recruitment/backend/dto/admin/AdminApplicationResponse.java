package com.recruitment.backend.dto.admin;

import lombok.Builder;
import lombok.Getter;

import java.time.OffsetDateTime;

@Getter
@Builder
public class AdminApplicationResponse {
    private Long id;
    private String jobTitle;
    private String companyName;
    private String applicantName;
    private String applicantEmail;
    private String status;
    private OffsetDateTime appliedAt;
}
