package com.recruitment.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobSummaryDto {

    private Long id;
    private String title;
    private String companyName;
    private String location;
    private String employmentType;
    private String experienceLevel;
    private String status;
    private OffsetDateTime createdAt;
}
