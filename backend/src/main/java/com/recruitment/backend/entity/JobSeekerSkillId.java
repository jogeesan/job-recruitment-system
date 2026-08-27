package com.recruitment.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class JobSeekerSkillId implements Serializable {

    @Column(name = "job_seeker_id")
    private Long jobSeekerId;

    @Column(name = "skill_id")
    private Long skillId;
}
