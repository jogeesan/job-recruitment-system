-- Apply to existing databases to support candidate interview responses.
BEGIN;
ALTER TABLE interviews DROP CONSTRAINT IF EXISTS chk_interview_status;
ALTER TABLE interviews ADD CONSTRAINT chk_interview_status
    CHECK (status IN ('SCHEDULED', 'ACCEPTED', 'DECLINED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'));
COMMIT;
