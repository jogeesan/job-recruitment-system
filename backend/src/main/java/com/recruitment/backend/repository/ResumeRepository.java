package com.recruitment.backend.repository;

import com.recruitment.backend.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {

    List<Resume> findByJobSeekerId(Long jobSeekerId);

    Optional<Resume> findByJobSeekerIdAndIsDefaultTrue(Long jobSeekerId);

    long countByJobSeekerId(Long jobSeekerId);
}
