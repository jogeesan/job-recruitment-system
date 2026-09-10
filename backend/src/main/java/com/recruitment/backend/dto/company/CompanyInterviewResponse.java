package com.recruitment.backend.dto.company;

import lombok.Builder;
import lombok.Getter;

import java.time.OffsetDateTime;

@Getter
@Builder
public class CompanyInterviewResponse {
    private Long id;
    private Long applicationId;
    private String applicantName;
    private String applicantEmail;
    private String jobTitle;
    private String interviewType;
    private OffsetDateTime scheduledAt;
    private Integer durationMinutes;
    private String location;
    private String meetingLink;
    private String status;
    private String notes;
}
