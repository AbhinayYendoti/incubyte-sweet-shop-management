-- Migration V3: Add image_url column to sweet_items table
-- This migration adds support for image URLs in the sweet items catalog

ALTER TABLE sweet_items ADD COLUMN image_url VARCHAR(500);

