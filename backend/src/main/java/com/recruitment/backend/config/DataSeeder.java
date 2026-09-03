package com.recruitment.backend.config;

import com.recruitment.backend.entity.Role;
import com.recruitment.backend.entity.User;
import com.recruitment.backend.repository.RoleRepository;
import com.recruitment.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * DataSeeder — Application startup-ல் ஒரு முறை மட்டும் இயங்கும்.
 * ADMIN role மற்றும் default admin user இல்லாவிட்டால் create பண்ணும்.
 *
 * Default Admin Credentials:
 *   Email    : admin@recruitflow.com
 *   Password : Admin@1234
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ─── Default Admin Credentials (change after first login) ──────────────────
    private static final String ADMIN_EMAIL    = "admin@recruitflow.com";
    private static final String ADMIN_PASSWORD = "Admin@1234";
    private static final String ADMIN_ROLE     = "ADMIN";

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedAdminRole();
        seedAdminUser();
    }

    // ─── Seed ADMIN role if it does not already exist ─────────────────────────
    private void seedAdminRole() {
        if (!roleRepository.existsByName(ADMIN_ROLE)) {
            Role role = Role.builder()
                    .name(ADMIN_ROLE)
                    .description("Platform administrator with full access")
                    .build();
            roleRepository.save(role);
            log.info("✅ [DataSeeder] ADMIN role created in DB.");
        } else {
            log.info("ℹ️  [DataSeeder] ADMIN role already exists — skipped.");
        }
    }

    // ─── Seed default admin user if none exists ────────────────────────────────
    private void seedAdminUser() {
        if (userRepository.existsByEmail(ADMIN_EMAIL)) {
            log.info("ℹ️  [DataSeeder] Admin user '{}' already exists — skipped.", ADMIN_EMAIL);
            return;
        }

        Role adminRole = roleRepository.findByName(ADMIN_ROLE)
                .orElseThrow(() -> new IllegalStateException(
                        "ADMIN role not found — seedAdminRole() must run first"));

        User admin = User.builder()
                .firstName("System")
                .lastName("Admin")
                .email(ADMIN_EMAIL)
                .passwordHash(passwordEncoder.encode(ADMIN_PASSWORD))
                .role(adminRole)
                .status("ACTIVE")
                .build();

        userRepository.save(admin);
        log.info("✅ [DataSeeder] Default admin user created.");
        log.info("   Email    : {}", ADMIN_EMAIL);
        log.info("   Password : {}", ADMIN_PASSWORD);
        log.warn("⚠️  Change the admin password after first login!");
    }
}
