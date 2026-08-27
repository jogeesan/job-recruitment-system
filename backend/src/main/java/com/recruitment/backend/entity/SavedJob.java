package com.recruitment.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "saved_jobs",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_saved_job",
                columnNames = {"job_seeker_id", "job_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_seeker_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_saved_jobs_seeker"))
    private JobSeeker jobSeeker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_saved_jobs_job"))
    private Job job;

    @Column(name = "saved_at", nullable = false, updatable = false)
    private OffsetDateTime savedAt;

    @PrePersist
    protected void onCreate() {
        this.savedAt = OffsetDateTime.now();
    }
}
