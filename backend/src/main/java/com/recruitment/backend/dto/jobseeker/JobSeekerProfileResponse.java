package com.recruitment.backend.dto.jobseeker;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
public class JobSeekerProfileResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String headline;
    private String bio;
    private String location;
    private BigDecimal yearsOfExperience;
    private String profileImageUrl;
}
