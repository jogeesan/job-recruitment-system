package com.recruitment.backend;

import com.recruitment.backend.controller.CompanyController;
import com.recruitment.backend.controller.JobSeekerController;
import com.recruitment.backend.dto.company.ScheduleInterviewRequest;
import com.recruitment.backend.repository.ApplicationRepository;
import com.recruitment.backend.repository.InterviewRepository;
import com.recruitment.backend.repository.NotificationRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;
import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assumptions.assumeFalse;

@SpringBootTest
@Transactional
class InterviewFlowTests {
    @Autowired CompanyController company;
    @Autowired JobSeekerController seeker;
    @Autowired ApplicationRepository applications;
    @Autowired InterviewRepository interviews;
    @Autowired NotificationRepository notifications;

    @AfterEach
    void clearAuthentication() { SecurityContextHolder.clearContext(); }

    @ParameterizedTest
    @CsvSource({"VIDEO,ACCEPTED", "ONLINE,DECLINED", "PHONE,ACCEPTED", "ONSITE,DECLINED"})
    void scheduleListRespondAndComplete(String type, String response) {
        // Uses a local application; all interview and notification writes roll back.
        var existing = applications.findAll();
        assumeFalse(existing.isEmpty(), "Requires a job application in the integration database");
        var application = existing.getFirst();
        var employer = application.getJob().getCompany().getUser();
        var candidate = application.getJobSeeker().getUser();
        var hr = authenticate(employer.getEmail(), "HR");
        long candidateNotifications = notifications.countByUserIdAndIsRead(candidate.getId(), false);
        var request = new ScheduleInterviewRequest();
        request.setInterviewType(type);
        request.setScheduledAt(OffsetDateTime.now().plusDays(2));
        request.setDurationMinutes(60);
        var result = company.scheduleInterview(hr, application.getId(), request);
        assertEquals(201, result.getStatusCode().value());
        var interview = result.getBody().getData();
        interviews.flush();
        notifications.flush();
        assertEquals(type.equals("VIDEO") ? "ONLINE" : type, interview.getInterviewType());
        assertEquals(candidateNotifications + 1, notifications.countByUserIdAndIsRead(candidate.getId(), false));
        assertTrue(company.getInterviews(hr).getBody().getData().stream().anyMatch(i -> i.getId().equals(interview.getId())));
        var jobSeeker = authenticate(candidate.getEmail(), "JOB_SEEKER");
        assertTrue(seeker.getInterviews(jobSeeker).getBody().getData().stream().anyMatch(i -> i.getId().equals(interview.getId())));
        long hrNotifications = notifications.countByUserIdAndIsRead(employer.getId(), false);
        assertEquals(response, seeker.respondToInterview(jobSeeker, interview.getId(), response).getBody().getData().getStatus());
        interviews.flush();
        notifications.flush();
        assertEquals(hrNotifications + 1, notifications.countByUserIdAndIsRead(employer.getId(), false));
        assertEquals(409, seeker.respondToInterview(jobSeeker, interview.getId(), response).getStatusCode().value());
        authenticate(employer.getEmail(), "HR");
        assertEquals(400, company.updateInterviewStatus(hr, interview.getId(), "INVALID").getStatusCode().value());
        assertEquals("COMPLETED", company.updateInterviewStatus(hr, interview.getId(), "COMPLETED").getBody().getData().getStatus());
        interviews.flush();
    }

    private UserDetails authenticate(String email, String role) {
        var user = User.withUsername(email).password("unused").roles(role).build();
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities()));
        return user;
    }
}
