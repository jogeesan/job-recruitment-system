package com.recruitment.backend.repository;

import com.recruitment.backend.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    List<Company> findByVerificationStatus(String verificationStatus);

    List<Company> findByIndustry(String industry);

    List<Company> findByCityAndCountry(String city, String country);

    List<Company> findByCompanyNameContainingIgnoreCase(String keyword);
}
