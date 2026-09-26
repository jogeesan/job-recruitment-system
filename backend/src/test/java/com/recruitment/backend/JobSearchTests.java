package com.recruitment.backend;

import com.recruitment.backend.controller.JobController;
import com.recruitment.backend.dto.job.JobSummaryResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class JobSearchTests {
    @Autowired
    private JobController controller;

    @Autowired
    private JdbcTemplate jdbc;

    @Test
    void unfilteredSearchReturnsAllOpenAndPublishedJobs() {
        var expectedIds = jdbc.queryForList(
                "SELECT id FROM jobs WHERE status IN ('OPEN', 'PUBLISHED') ORDER BY id", Long.class);
        var jobs = controller.searchJobs(null, null, null).getBody().getData();
        assertEquals(expectedIds, jobs.stream().map(JobSummaryResponse::getId).sorted().toList());
        for (var job : jobs) {
            assertEquals(job.getId(), controller.getJob(job.getId()).getBody().getData().getId());
        }
    }

    @Test
    void searchAcceptsMissingAndBlankFilters() {
        assertDoesNotThrow(() -> controller.searchJobs(null, null, null));
        assertDoesNotThrow(() -> controller.searchJobs("", " ", ""));
    }

    @Test
    void searchAcceptsIndividualFilters() {
        assertDoesNotThrow(() -> controller.searchJobs("software", null, null));
        assertDoesNotThrow(() -> controller.searchJobs(null, "moratuwa", null));
        assertDoesNotThrow(() -> controller.searchJobs(null, null, "FULL_TIME"));
    }
}
