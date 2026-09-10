package com.recruitment.backend.repository;

import com.recruitment.backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    long countByJobSeekerId(Long jobSeekerId);

    long countByJobSeekerIdAndStatus(Long jobSeekerId, String status);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.company.id = :companyId")
    long countByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.company.id = :companyId AND a.status = :status")
    long countByCompanyIdAndStatus(@Param("companyId") Long companyId, @Param("status") String status);
}
