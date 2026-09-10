package com.recruitment.backend.dto.company;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class CreateCompanyJobRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    private String responsibilities;
    private String requirements;
    private String location;
    @NotBlank
    private String employmentType;
    private String experienceLevel;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private LocalDate applicationDeadline;
    private String status;
}
