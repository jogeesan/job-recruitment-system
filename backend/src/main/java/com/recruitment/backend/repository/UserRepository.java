package com.recruitment.backend.repository;

import com.recruitment.backend.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // role JOIN FETCH — LazyInitializationException தவிர்க்க
    @EntityGraph(attributePaths = {"role"})
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @EntityGraph(attributePaths = {"role"})
    List<User> findByStatus(String status);

    @EntityGraph(attributePaths = {"role"})
    List<User> findByRoleId(Long roleId);

    @EntityGraph(attributePaths = {"role"})
    List<User> findByRoleName(String roleName);
}
