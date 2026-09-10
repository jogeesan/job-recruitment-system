package com.recruitment.backend.dto.company;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCompanyProfileRequest {
    @NotBlank
    private String companyName;
    private String description;
    private String industry;
    private String website;
    private String logoUrl;
    private String address;
    private String city;
    private String country;
    private String companySize;
}
