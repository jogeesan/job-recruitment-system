package com.recruitment.backend.dto.job;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Getter
@Builder
public class JobDetailsResponse {
    private Long id;
    private String title;
    private String description;
    private String responsibilities;
    private String requirements;
    private String companyName;
    private String companyDescription;
    private String companyWebsite;
    private String location;
    private String employmentType;
    private String experienceLevel;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private LocalDate applicationDeadline;
    private String status;
    private OffsetDateTime createdAt;
}
