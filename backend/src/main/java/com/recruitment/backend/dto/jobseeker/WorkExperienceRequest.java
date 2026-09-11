package com.recruitment.backend.dto.jobseeker;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class WorkExperienceRequest {
    @NotBlank private String companyName;
    @NotBlank private String jobTitle;
    private String location;
    @NotNull private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isCurrent = false;
    private String description;
}
