package com.recruitment.backend.repository;

import com.recruitment.backend.entity.JobSeekerSkill;
import com.recruitment.backend.entity.JobSeekerSkillId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobSeekerSkillRepository extends JpaRepository<JobSeekerSkill, JobSeekerSkillId> {

    List<JobSeekerSkill> findByJobSeekerId(Long jobSeekerId);

    List<JobSeekerSkill> findBySkillId(Long skillId);

    void deleteByJobSeekerId(Long jobSeekerId);
}
