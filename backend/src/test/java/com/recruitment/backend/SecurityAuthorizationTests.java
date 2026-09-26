package com.recruitment.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.WebApplicationContext;
import jakarta.servlet.Filter;
import org.springframework.test.web.servlet.MockMvc;
import org.junit.jupiter.api.BeforeEach;

import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class SecurityAuthorizationTests {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private Filter springSecurityFilterChain;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = webAppContextSetup(webApplicationContext)
                .addFilters(springSecurityFilterChain)
                .build();
    }

    @Test
    void protectedEndpointsRejectUnauthenticatedRequests() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard"))
                .andExpect(result -> assertRejected(result.getResponse().getStatus()));
        mockMvc.perform(get("/api/company/dashboard"))
                .andExpect(result -> assertRejected(result.getResponse().getStatus()));
        mockMvc.perform(get("/api/job-seeker/applications"))
                .andExpect(result -> assertRejected(result.getResponse().getStatus()));
        mockMvc.perform(get("/api/notifications"))
                .andExpect(result -> assertRejected(result.getResponse().getStatus()));
    }

    @Test
    void accountSettingsRejectUnauthenticatedRequests() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    private void assertRejected(int statusCode) {
        assertTrue(statusCode == 401 || statusCode == 403,
                "Expected an authentication rejection but received " + statusCode);
    }
}
