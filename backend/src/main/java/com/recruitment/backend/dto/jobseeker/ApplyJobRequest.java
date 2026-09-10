package com.recruitment.backend.dto.jobseeker;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplyJobRequest {
    @Size(max = 10000)
    private String coverLetter;
    private Long resumeId;
}
