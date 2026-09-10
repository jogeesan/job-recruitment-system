package com.recruitment.backend.repository;

import com.recruitment.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByCompanyId(Long companyId);

    List<Job> findByStatus(String status);

    long countByStatus(String status);

    long countByCompanyIdAndStatus(Long companyId, String status);

    List<Job> findByEmploymentType(String employmentType);

    List<Job> findByLocationContainingIgnoreCase(String location);

    List<Job> findByStatusAndApplicationDeadlineAfter(String status, LocalDate date);

    @Query("""
            SELECT j FROM Job j
            WHERE j.status IN ('OPEN', 'PUBLISHED')
            AND (:keyword IS NULL
                 OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                 OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND (:location IS NULL
                 OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))
            AND (:employmentType IS NULL OR j.employmentType = :employmentType)
            """)
    List<Job> searchJobs(
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("employmentType") String employmentType
    );
}
