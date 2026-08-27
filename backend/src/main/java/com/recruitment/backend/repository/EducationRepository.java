package com.recruitment.backend.repository;

import com.recruitment.backend.entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EducationRepository extends JpaRepository<Education, Long> {

    List<Education> findByJobSeekerId(Long jobSeekerId);

    List<Education> findByJobSeekerIdOrderByStartDateDesc(Long jobSeekerId);

    void deleteByJobSeekerId(Long jobSeekerId);
}
