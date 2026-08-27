package com.recruitment.backend.repository;

import com.recruitment.backend.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {

    List<Interview> findByApplicationId(Long applicationId);

    List<Interview> findByInterviewerId(Long interviewerId);

    List<Interview> findByStatus(String status);

    List<Interview> findByScheduledAtBetween(OffsetDateTime from, OffsetDateTime to);

    List<Interview> findByApplicationIdAndStatus(Long applicationId, String status);
}
