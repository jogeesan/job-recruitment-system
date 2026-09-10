package com.recruitment.backend.dto.admin;

import lombok.Builder;
import lombok.Getter;

import java.time.OffsetDateTime;

@Getter
@Builder
public class AdminJobResponse {
    private Long id;
    private String title;
    private String companyName;
    private String location;
    private String employmentType;
    private String status;
    private long applicationCount;
    private OffsetDateTime createdAt;
}
