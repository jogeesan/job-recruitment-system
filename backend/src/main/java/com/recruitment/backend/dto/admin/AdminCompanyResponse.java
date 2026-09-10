package com.recruitment.backend.dto.admin;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminCompanyResponse {
    private Long id;
    private String companyName;
    private String ownerName;
    private String ownerEmail;
    private String industry;
    private String city;
    private String country;
    private String verificationStatus;
    private long jobCount;
}
