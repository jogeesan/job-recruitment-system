package com.recruitment.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "job_seeker_skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobSeekerSkill {

    @EmbeddedId
    private JobSeekerSkillId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("jobSeekerId")
    @JoinColumn(name = "job_seeker_id",
            foreignKey = @ForeignKey(name = "fk_job_seeker_skills_seeker"))
    private JobSeeker jobSeeker;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("skillId")
    @JoinColumn(name = "skill_id",
            foreignKey = @ForeignKey(name = "fk_job_seeker_skills_skill"))
    private Skill skill;

    @Column(name = "proficiency_level", length = 50)
    private String proficiencyLevel;

    @Column(name = "years_of_experience", nullable = false, precision = 4, scale = 1)
    @Builder.Default
    private BigDecimal yearsOfExperience = BigDecimal.ZERO;
}
