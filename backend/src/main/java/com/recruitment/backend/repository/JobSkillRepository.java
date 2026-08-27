package com.recruitment.backend.repository;

import com.recruitment.backend.entity.JobSkill;
import com.recruitment.backend.entity.JobSkillId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobSkillRepository extends JpaRepository<JobSkill, JobSkillId> {

    List<JobSkill> findByJobId(Long jobId);

    List<JobSkill> findBySkillId(Long skillId);

    List<JobSkill> findByJobIdAndIsRequired(Long jobId, Boolean isRequired);

    void deleteByJobId(Long jobId);
}
