package com.recruitment.backend.dto.jobseeker;

import com.recruitment.backend.entity.Skill;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class ProfileDataResponse {
    private List<EducationItem> education;
    private List<ExperienceItem> experience;
    private List<SkillItem> skills;

    @Getter @Builder
    public static class EducationItem {
        private Long id; private String institution; private String degree; private String fieldOfStudy;
        private LocalDate startDate; private LocalDate endDate; private String description;
    }
    @Getter @Builder
    public static class ExperienceItem {
        private Long id; private String companyName; private String jobTitle; private String location;
        private LocalDate startDate; private LocalDate endDate; private Boolean isCurrent; private String description;
    }
    @Getter @Builder
    public static class SkillItem {
        private Long id; private Long skillId; private String name; private String proficiencyLevel; private BigDecimal yearsOfExperience;
    }
}
