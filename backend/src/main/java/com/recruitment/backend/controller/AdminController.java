package com.recruitment.backend.controller;

import com.recruitment.backend.dto.admin.CompanySummaryDto;
import com.recruitment.backend.dto.admin.DashboardStatsDto;
import com.recruitment.backend.dto.admin.JobSummaryDto;
import com.recruitment.backend.dto.admin.UserSummaryDto;
import com.recruitment.backend.dto.common.ApiResponse;
import com.recruitment.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    // ─── Dashboard Stats ──────────────────────────────────────────────────────
    // GET /api/admin/stats
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        return ResponseEntity.ok(
                ApiResponse.ok("Dashboard stats", adminService.getDashboardStats())
        );
    }

    // ─── User Management ──────────────────────────────────────────────────────
    // GET /api/admin/users
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserSummaryDto>>> getAllUsers() {
        return ResponseEntity.ok(
                ApiResponse.ok("All users", adminService.getAllUsers())
        );
    }

    // GET /api/admin/users?role=JOB_SEEKER|HR|ADMIN
    @GetMapping("/users/role/{roleName}")
    public ResponseEntity<ApiResponse<List<UserSummaryDto>>> getUsersByRole(
            @PathVariable String roleName) {
        return ResponseEntity.ok(
                ApiResponse.ok("Users by role: " + roleName, adminService.getUsersByRole(roleName))
        );
    }

    // PATCH /api/admin/users/{id}/status
    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserSummaryDto>> updateUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            String newStatus = body.get("status");
            if (newStatus == null || newStatus.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("'status' field is required"));
            }
            return ResponseEntity.ok(
                    ApiResponse.ok("User status updated", adminService.updateUserStatus(id, newStatus))
            );
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(ex.getMessage()));
        }
    }

    // ─── Company Verification ─────────────────────────────────────────────────
    // GET /api/admin/companies
    @GetMapping("/companies")
    public ResponseEntity<ApiResponse<List<CompanySummaryDto>>> getAllCompanies() {
        return ResponseEntity.ok(
                ApiResponse.ok("All companies", adminService.getAllCompanies())
        );
    }

    // GET /api/admin/companies/status/{status}
    @GetMapping("/companies/status/{status}")
    public ResponseEntity<ApiResponse<List<CompanySummaryDto>>> getCompaniesByStatus(
            @PathVariable String status) {
        return ResponseEntity.ok(
                ApiResponse.ok("Companies with status: " + status,
                        adminService.getCompaniesByStatus(status))
        );
    }

    // PATCH /api/admin/companies/{id}/verify
    @PatchMapping("/companies/{id}/verify")
    public ResponseEntity<ApiResponse<CompanySummaryDto>> verifyCompany(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            String newStatus = body.get("status");
            if (newStatus == null || newStatus.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("'status' field is required (PENDING, APPROVED, REJECTED)"));
            }
            return ResponseEntity.ok(
                    ApiResponse.ok("Company verification updated",
                            adminService.updateCompanyVerification(id, newStatus))
            );
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(ex.getMessage()));
        }
    }

    // ─── Job Moderation ───────────────────────────────────────────────────────
    // GET /api/admin/jobs
    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<List<JobSummaryDto>>> getAllJobs() {
        return ResponseEntity.ok(
                ApiResponse.ok("All jobs", adminService.getAllJobs())
        );
    }

    // GET /api/admin/jobs/status/{status}
    @GetMapping("/jobs/status/{status}")
    public ResponseEntity<ApiResponse<List<JobSummaryDto>>> getJobsByStatus(
            @PathVariable String status) {
        return ResponseEntity.ok(
                ApiResponse.ok("Jobs with status: " + status,
                        adminService.getJobsByStatus(status))
        );
    }

    // PATCH /api/admin/jobs/{id}/status
    @PatchMapping("/jobs/{id}/status")
    public ResponseEntity<ApiResponse<JobSummaryDto>> updateJobStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            String newStatus = body.get("status");
            if (newStatus == null || newStatus.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("'status' field is required (DRAFT, OPEN, CLOSED)"));
            }
            return ResponseEntity.ok(
                    ApiResponse.ok("Job status updated", adminService.updateJobStatus(id, newStatus))
            );
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(ex.getMessage()));
        }
    }

    // DELETE /api/admin/jobs/{id}
    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id) {
        try {
            adminService.deleteJob(id);
            return ResponseEntity.ok(ApiResponse.ok("Job deleted successfully", null));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(ex.getMessage()));
        }
    }
}
