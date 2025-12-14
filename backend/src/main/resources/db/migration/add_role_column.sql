-- Migration: Add role column to users table
-- This script is idempotent and safe to run multiple times
-- Fixes: "column u1_0.role does not exist" error

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'role'
    ) THEN
        ALTER TABLE users 
        ADD COLUMN role VARCHAR(255) NOT NULL DEFAULT 'USER';
        
        -- Update existing rows to have USER role if any exist
        UPDATE users SET role = 'USER' WHERE role IS NULL;
    END IF;
END $$;


