package com.recruitment.backend.dto.jobseeker;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class UpdateJobSeekerProfileRequest {
    private LocalDate dateOfBirth;
    private String gender;

    @Size(max = 255)
    private String headline;

    private String bio;
    private String location;
    private BigDecimal yearsOfExperience;
    private String profileImageUrl;
}
