package com.recruitment.backend.dto.company;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateApplicationStatusRequest {
    @NotBlank
    private String status;
}
