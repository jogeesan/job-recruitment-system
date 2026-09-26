package com.recruitment.backend.dto.company;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class ScheduleInterviewRequest {
    @NotBlank
    @Pattern(regexp = "ONLINE|VIDEO|PHONE|ONSITE", message = "Choose a supported interview type")
    private String interviewType;
    @NotNull
    @Future(message = "Choose a future interview date and time")
    private OffsetDateTime scheduledAt;
    @NotNull
    @Positive(message = "Interview duration must be greater than zero")
    private Integer durationMinutes;
    private String location;
    private String meetingLink;
    private String notes;
}
