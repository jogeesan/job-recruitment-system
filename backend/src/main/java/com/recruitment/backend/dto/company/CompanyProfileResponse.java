package com.recruitment.backend.dto.company;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CompanyProfileResponse {
    private Long id;
    private String companyName;
    private String description;
    private String industry;
    private String website;
    private String logoUrl;
    private String address;
    private String city;
    private String country;
    private String companySize;
    private String verificationStatus;
}
