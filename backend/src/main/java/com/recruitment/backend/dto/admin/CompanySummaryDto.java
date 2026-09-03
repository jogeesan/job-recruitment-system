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
public class CompanySummaryDto {

    private Long id;
    private Long userId;
    private String recruiterName;
    private String recruiterEmail;
    private String companyName;
    private String industry;
    private String website;
    private String city;
    private String country;
    private String companySize;
    private String verificationStatus;
    private OffsetDateTime createdAt;
}
