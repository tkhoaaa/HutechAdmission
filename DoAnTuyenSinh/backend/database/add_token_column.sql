-- Add token column to users table for JWT session management
ALTER TABLE users ADD COLUMN IF NOT EXISTS token VARCHAR(1024) DEFAULT NULL AFTER avatar;

-- Add index for faster token lookup
ALTER TABLE users ADD INDEX idx_users_token (token);
