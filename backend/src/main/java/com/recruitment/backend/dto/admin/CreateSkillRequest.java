package com.recruitment.backend.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateSkillRequest {
    @NotBlank
    private String name;
}
