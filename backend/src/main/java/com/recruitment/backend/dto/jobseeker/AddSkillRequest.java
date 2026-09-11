package com.recruitment.backend.dto.jobseeker;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class AddSkillRequest {
    @NotNull private Long skillId;
    private String proficiencyLevel;
    private BigDecimal yearsOfExperience = BigDecimal.ZERO;
}
