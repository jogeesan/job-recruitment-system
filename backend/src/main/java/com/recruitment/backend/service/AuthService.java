package com.recruitment.backend.service;

import com.recruitment.backend.dto.auth.AuthResponse;
import com.recruitment.backend.dto.auth.LoginRequest;
import com.recruitment.backend.dto.auth.RegisterRequest;
import com.recruitment.backend.entity.Company;
import com.recruitment.backend.entity.Role;
import com.recruitment.backend.entity.User;
import com.recruitment.backend.repository.CompanyRepository;
import com.recruitment.backend.repository.JobSeekerRepository;
import com.recruitment.backend.repository.RoleRepository;
import com.recruitment.backend.repository.UserRepository;
import com.recruitment.backend.security.CustomUserDetailsService;
import com.recruitment.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CompanyRepository companyRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;

    // ─── Register ─────────────────────────────────────────────────────────────
    @Transactional
    public AuthResponse register(RegisterRequest request) {

        // Email duplicate check
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException(
                    "Email already registered: " + request.getEmail());
        }

        // Role lookup (default: JOB_SEEKER)
        String roleName = (request.getRoleName() != null
                && !request.getRoleName().isBlank())
                ? request.getRoleName().toUpperCase()
                : "JOB_SEEKER";

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() ->
                        new IllegalArgumentException("Role not found: " + roleName));

        // Create user
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(role)
                .status("ACTIVE")
                .build();

        user = userRepository.save(user);

        // If HR and company name provided, create Company profile
        if ("HR".equals(role.getName()) && request.getCompanyName() != null && !request.getCompanyName().isBlank()) {
            Company company = Company.builder()
                    .user(user)
                    .companyName(request.getCompanyName().trim())
                    .companySize(request.getCompanySize())
                    .verificationStatus("PENDING")
                    .build();
            companyRepository.save(company);
        }

        if ("JOB_SEEKER".equals(role.getName())) {
            jobSeekerRepository.save(com.recruitment.backend.entity.JobSeeker.builder()
                    .user(user)
                    .build());
        }

        // Generate JWT
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails, user.getId(), role.getName());

        return buildAuthResponse(token, user, role.getName());
    }

    // ─── Login ────────────────────────────────────────────────────────────────
    public AuthResponse login(LoginRequest request) {

        // Authenticate (throws exception if invalid)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        if (!"ACTIVE".equals(user.getStatus())) {
            throw new IllegalStateException("Account is " + user.getStatus());
        }

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(
                userDetails, user.getId(), user.getRole().getName());

        return buildAuthResponse(token, user, user.getRole().getName());
    }

    // ─── Helper ───────────────────────────────────────────────────────────────
    private AuthResponse buildAuthResponse(String token, User user, String roleName) {
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(roleName)
                .status(user.getStatus())
                .build();
    }
}
