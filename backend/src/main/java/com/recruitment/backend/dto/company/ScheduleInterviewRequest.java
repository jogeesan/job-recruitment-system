package com.recruitment.backend.dto.company;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class ScheduleInterviewRequest {
    @NotBlank
    private String interviewType;
    @NotNull
    private OffsetDateTime scheduledAt;
    @NotNull
    private Integer durationMinutes;
    private String location;
    private String meetingLink;
    private String notes;
}
