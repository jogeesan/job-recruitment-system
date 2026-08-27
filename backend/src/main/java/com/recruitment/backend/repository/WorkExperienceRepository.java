package com.recruitment.backend.repository;

import com.recruitment.backend.entity.WorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkExperienceRepository extends JpaRepository<WorkExperience, Long> {

    List<WorkExperience> findByJobSeekerId(Long jobSeekerId);

    List<WorkExperience> findByJobSeekerIdOrderByStartDateDesc(Long jobSeekerId);

    List<WorkExperience> findByJobSeekerIdAndIsCurrentTrue(Long jobSeekerId);

    void deleteByJobSeekerId(Long jobSeekerId);
}
