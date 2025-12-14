-- Migration V4: Add category column to sweet_items table
-- This migration adds support for categorizing sweets (e.g., mithai, ladoo, barfi, halwa, namkeen)

ALTER TABLE sweet_items ADD COLUMN category VARCHAR(50);

