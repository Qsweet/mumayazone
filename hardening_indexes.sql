-- Hardening Indexes for Performance (2025 Standard)
-- Ensure foreign keys are indexed for faster joins and lookups

-- Users: Email index already exists (unique constraint), adding index on role for filtering if needed
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);

-- Refresh Tokens: Index userId for faster token validation
CREATE INDEX IF NOT EXISTS refresh_tokens_user_idx ON refresh_tokens(user_id);
-- Index tokenHash for faster lookup
CREATE INDEX IF NOT EXISTS refresh_tokens_hash_idx ON refresh_tokens(token_hash);

-- Audit Logs: Index userId for timeline lookups
CREATE INDEX IF NOT EXISTS audit_logs_user_idx ON audit_logs(user_id);
-- Index createdAt for recent logs query
CREATE INDEX IF NOT EXISTS audit_logs_created_idx ON audit_logs(created_at DESC);

-- Social Accounts: Index userId
CREATE INDEX IF NOT EXISTS social_accounts_user_idx ON social_accounts(user_id);
