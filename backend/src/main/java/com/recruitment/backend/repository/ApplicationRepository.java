package com.recruitment.backend.repository;

import com.recruitment.backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByJobId(Long jobId);

    List<Application> findByJobSeekerId(Long jobSeekerId);

    List<Application> findByStatus(String status);

    List<Application> findByJobIdAndStatus(Long jobId, String status);

    Optional<Application> findByJobIdAndJobSeekerId(Long jobId, Long jobSeekerId);

    boolean existsByJobIdAndJobSeekerId(Long jobId, Long jobSeekerId);

    long countByJobId(Long jobId);

    long countByJobSeekerIdAndStatus(Long jobSeekerId, String status);
}
