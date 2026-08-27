package com.recruitment.backend.repository;

import com.recruitment.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByStatus(String status);

    List<User> findByRoleId(Long roleId);

    List<User> findByRoleName(String roleName);
}
