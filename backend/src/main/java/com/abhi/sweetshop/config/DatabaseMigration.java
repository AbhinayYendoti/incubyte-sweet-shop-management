package com.abhi.sweetshop.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Database migration component to add missing 'role' column to users table.
 * Fixes: "column u1_0.role does not exist" error.
 * This runs automatically on application startup and is idempotent.
 */
@Component
@Order(1) // Run early, before JPA repositories are used
public class DatabaseMigration {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseMigration.class);

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public DatabaseMigration(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void migrate() {
        try {
            // Check if 'role' column exists in 'users' table
            String checkColumnSql = """
                SELECT COUNT(*) 
                FROM information_schema.columns 
                WHERE table_name = 'users' 
                AND column_name = 'role'
                """;
            
            Integer count = jdbcTemplate.queryForObject(checkColumnSql, Integer.class);
            
            if (count == null || count == 0) {
                logger.info("Adding missing 'role' column to 'users' table...");
                
                // Check if users table exists first
                String checkTableSql = """
                    SELECT COUNT(*) 
                    FROM information_schema.tables 
                    WHERE table_name = 'users'
                    """;
                Integer tableExists = jdbcTemplate.queryForObject(checkTableSql, Integer.class);
                
                if (tableExists != null && tableExists > 0) {
                    // Add the role column with default value
                    String addColumnSql = """
                        ALTER TABLE users 
                        ADD COLUMN role VARCHAR(255) NOT NULL DEFAULT 'USER'
                        """;
                    
                    jdbcTemplate.execute(addColumnSql);
                    
                    // Update any existing NULL values (shouldn't happen with NOT NULL, but safety check)
                    String updateNullsSql = "UPDATE users SET role = 'USER' WHERE role IS NULL";
                    int updated = jdbcTemplate.update(updateNullsSql);
                    
                    logger.info("Successfully added 'role' column to 'users' table. Updated {} existing rows.", updated);
                } else {
                    logger.info("'users' table does not exist yet. Hibernate will create it with 'role' column on first use.");
                }
            } else {
                logger.debug("'role' column already exists in 'users' table. Skipping migration.");
            }
        } catch (Exception e) {
            // Log error but don't fail startup - allows manual intervention if needed
            logger.error("Error during database migration for 'role' column: {}", e.getMessage(), e);
            // In production, you might want to fail fast, but for now we'll just log
        }
    }
}


