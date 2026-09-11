package com.recruitment.backend.dto.jobseeker;

import lombok.Builder;
import lombok.Getter;

import java.time.OffsetDateTime;

@Getter
@Builder
public class InterviewResponse {
    private Long id;
    private Long applicationId;
    private String jobTitle;
    private String companyName;
    private String interviewType;
    private OffsetDateTime scheduledAt;
    private Integer durationMinutes;
    private String location;
    private String meetingLink;
    private String status;
    private String notes;
}
