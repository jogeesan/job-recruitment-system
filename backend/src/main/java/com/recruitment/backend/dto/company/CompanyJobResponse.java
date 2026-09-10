package com.recruitment.backend.dto.company;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Getter
@Builder
public class CompanyJobResponse {
    private Long id;
    private String title;
    private String description;
    private String responsibilities;
    private String requirements;
    private String location;
    private String employmentType;
    private String experienceLevel;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private LocalDate applicationDeadline;
    private String status;
    private long applicationCount;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
