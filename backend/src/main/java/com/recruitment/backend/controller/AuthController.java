package com.recruitment.backend.controller;

import com.recruitment.backend.dto.auth.AuthResponse;
import com.recruitment.backend.dto.auth.LoginRequest;
import com.recruitment.backend.dto.auth.RegisterRequest;
import com.recruitment.backend.dto.common.ApiResponse;
import com.recruitment.backend.entity.User;
import com.recruitment.backend.repository.UserRepository;
import com.recruitment.backend.service.AuthService;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseCookie;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    // ─── POST /api/auth/register ──────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse servletResponse) {
        try {
            AuthResponse response = authService.register(request);
            addAuthCookie(servletResponse, response.getToken());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok("Registration successful", response));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(ex.getMessage()));
        }
    }

    // ─── POST /api/auth/login ─────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse servletResponse) {
        try {
            AuthResponse response = authService.login(request);
            addAuthCookie(servletResponse, response.getToken());
            return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
        } catch (IllegalArgumentException | IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid email or password"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse servletResponse) {
        servletResponse.addHeader("Set-Cookie", ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build()
                .toString());
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully", null));
    }

    // ─── GET /api/auth/me ─────────────────────────────────────────────────────
    @GetMapping("/me")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<AuthResponse>> me(
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException(
                        "User not found: " + userDetails.getUsername()));

        AuthResponse response = AuthResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().getName())
                .status(user.getStatus())
                .build();

        return ResponseEntity.ok(ApiResponse.ok("User info", response));
    }

    private void addAuthCookie(HttpServletResponse response, String token) {
        response.addHeader("Set-Cookie", ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(86400)
                .sameSite("Lax")
                .build()
                .toString());
    }
}
