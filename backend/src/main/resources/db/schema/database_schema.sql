-- ============================================================================
-- Sweet Shop Management System - Database Schema
-- PostgreSQL Database Design
-- ============================================================================
-- 
-- This schema represents the complete database design for the application
-- based on analysis of all backend entities, services, and business logic.
--
-- Database: sweetshop
-- ============================================================================

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================
-- Stores user accounts with authentication and authorization
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_role CHECK (role IN ('USER', 'ADMIN')),
    CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================================================
-- 2. SWEET_ITEMS TABLE
-- ============================================================================
-- Stores catalog of available sweets (product catalog)
-- Note: This is separate from inventory - represents product definitions
-- ============================================================================

CREATE TABLE IF NOT EXISTS sweet_items (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_price_positive CHECK (price >= 0)
);

-- Indexes for sweet_items table
CREATE INDEX IF NOT EXISTS idx_sweet_items_name ON sweet_items(name);
CREATE INDEX IF NOT EXISTS idx_sweet_items_price ON sweet_items(price);

-- ============================================================================
-- 3. INVENTORY_ITEMS TABLE
-- ============================================================================
-- Stores inventory/stock management (separate from product catalog)
-- Note: Currently separate from sweet_items, but could be merged in future
-- ============================================================================

CREATE TABLE IF NOT EXISTS inventory_items (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_price_positive CHECK (price >= 0),
    CONSTRAINT chk_quantity_non_negative CHECK (quantity >= 0)
);

-- Indexes for inventory_items table
CREATE INDEX IF NOT EXISTS idx_inventory_items_name ON inventory_items(name);
CREATE INDEX IF NOT EXISTS idx_inventory_items_quantity ON inventory_items(quantity);
CREATE INDEX IF NOT EXISTS idx_inventory_items_low_stock ON inventory_items(quantity) WHERE quantity < 10;

-- ============================================================================
-- 4. ORDERS TABLE
-- ============================================================================
-- Stores customer orders
-- Note: Currently stores customerName as string, but should reference User
-- ============================================================================

CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_total_amount_non_negative CHECK (total_amount >= 0)
);

-- Indexes for orders table
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON orders(customer_name);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- ============================================================================
-- 5. ORDER_ITEMS TABLE (RECOMMENDED FOR PRODUCTION)
-- ============================================================================
-- Stores individual items within an order (many-to-many relationship)
-- This is currently missing but should exist for proper order management
-- ============================================================================

CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    sweet_item_id BIGINT REFERENCES sweet_items(id) ON DELETE SET NULL,
    inventory_item_id BIGINT REFERENCES inventory_items(id) ON DELETE SET NULL,
    item_name VARCHAR(255) NOT NULL, -- Denormalized for historical accuracy
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_quantity_positive CHECK (quantity > 0),
    CONSTRAINT chk_subtotal_calculation CHECK (subtotal = (quantity * unit_price)),
    CONSTRAINT chk_item_reference CHECK (
        (sweet_item_id IS NOT NULL AND inventory_item_id IS NULL) OR
        (sweet_item_id IS NULL AND inventory_item_id IS NOT NULL)
    )
);

-- Indexes for order_items table
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_sweet_item_id ON order_items(sweet_item_id);
CREATE INDEX IF NOT EXISTS idx_order_items_inventory_item_id ON order_items(inventory_item_id);

-- ============================================================================
-- 6. TRIGGERS FOR UPDATED_AT TIMESTAMP
-- ============================================================================
-- Automatically update updated_at column on row modification
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sweet_items_updated_at BEFORE UPDATE ON sweet_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON inventory_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. VIEWS FOR COMMON QUERIES
-- ============================================================================
-- ============================================================================

-- View: Orders with user information
CREATE OR REPLACE VIEW orders_with_users AS
SELECT 
    o.id,
    o.user_id,
    u.name AS user_name,
    u.email AS user_email,
    o.customer_name,
    o.total_amount,
    o.status,
    o.created_at,
    o.updated_at
FROM orders o
LEFT JOIN users u ON o.user_id = u.id;

-- View: Order summary with item count
CREATE OR REPLACE VIEW order_summary AS
SELECT 
    o.id,
    o.customer_name,
    o.total_amount,
    o.status,
    o.created_at,
    COUNT(oi.id) AS item_count,
    SUM(oi.quantity) AS total_items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.customer_name, o.total_amount, o.status, o.created_at;

-- View: Low stock inventory items
CREATE OR REPLACE VIEW low_stock_items AS
SELECT 
    id,
    name,
    description,
    price,
    quantity,
    CASE 
        WHEN quantity = 0 THEN 'OUT_OF_STOCK'
        WHEN quantity < 10 THEN 'LOW_STOCK'
        ELSE 'IN_STOCK'
    END AS stock_status
FROM inventory_items
WHERE quantity < 10
ORDER BY quantity ASC;

-- ============================================================================
-- 8. SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================================================
-- ============================================================================

-- Insert sample admin user (password should be hashed in production)
-- Password: admin123 (BCrypt hash example - replace with actual hash)
INSERT INTO users (name, email, password, role) VALUES
    ('Admin User', 'admin@sweetshop.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Insert sample regular user
-- Password: user123 (BCrypt hash example - replace with actual hash)
INSERT INTO users (name, email, password, role) VALUES
    ('Test User', 'user@sweetshop.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HHFuGgG3p0YqJ5J5J5J5J', 'USER')
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- 9. COMMENTS FOR DOCUMENTATION
-- ============================================================================
-- ============================================================================

COMMENT ON TABLE users IS 'Stores user accounts with authentication and authorization';
COMMENT ON TABLE sweet_items IS 'Product catalog - available sweets for sale';
COMMENT ON TABLE inventory_items IS 'Inventory management - tracks stock quantities';
COMMENT ON TABLE orders IS 'Customer orders with total amount and status';
COMMENT ON TABLE order_items IS 'Individual items within an order (order line items)';

COMMENT ON COLUMN users.role IS 'User role: USER or ADMIN';
COMMENT ON COLUMN orders.user_id IS 'Foreign key to users table (nullable for guest orders)';
COMMENT ON COLUMN orders.customer_name IS 'Customer name (denormalized for historical accuracy)';
COMMENT ON COLUMN order_items.item_name IS 'Item name at time of order (denormalized for historical accuracy)';
COMMENT ON COLUMN order_items.unit_price IS 'Price per unit at time of order (denormalized for historical accuracy)';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
