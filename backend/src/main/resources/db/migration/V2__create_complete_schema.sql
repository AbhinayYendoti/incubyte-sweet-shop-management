-- ============================================================================
-- Migration V2: Complete Database Schema
-- ============================================================================
-- This migration creates the complete database schema with all tables,
-- relationships, indexes, and constraints.
-- ============================================================================

-- ============================================================================
-- 1. USERS TABLE (if not exists)
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

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================================================
-- 2. SWEET_ITEMS TABLE (if not exists)
-- ============================================================================

CREATE TABLE IF NOT EXISTS sweet_items (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for sweet_items
CREATE INDEX IF NOT EXISTS idx_sweet_items_name ON sweet_items(name);
CREATE INDEX IF NOT EXISTS idx_sweet_items_price ON sweet_items(price);

-- ============================================================================
-- 3. INVENTORY_ITEMS TABLE (if not exists)
-- ============================================================================

CREATE TABLE IF NOT EXISTS inventory_items (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for inventory_items
CREATE INDEX IF NOT EXISTS idx_inventory_items_name ON inventory_items(name);
CREATE INDEX IF NOT EXISTS idx_inventory_items_quantity ON inventory_items(quantity);
CREATE INDEX IF NOT EXISTS idx_inventory_items_low_stock ON inventory_items(quantity) WHERE quantity < 10;

-- ============================================================================
-- 4. ORDERS TABLE (if not exists)
-- ============================================================================

CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add user_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE orders 
        ADD COLUMN user_id BIGINT REFERENCES users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add status column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'status'
    ) THEN
        ALTER TABLE orders 
        ADD COLUMN status VARCHAR(50) DEFAULT 'PENDING' 
        CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'));
    END IF;
END $$;

-- Indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON orders(customer_name);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- ============================================================================
-- 5. ORDER_ITEMS TABLE (RECOMMENDED - Currently Missing)
-- ============================================================================

CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    sweet_item_id BIGINT REFERENCES sweet_items(id) ON DELETE SET NULL,
    inventory_item_id BIGINT REFERENCES inventory_items(id) ON DELETE SET NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_subtotal_calculation CHECK (subtotal = (quantity * unit_price)),
    CONSTRAINT chk_item_reference CHECK (
        (sweet_item_id IS NOT NULL AND inventory_item_id IS NULL) OR
        (sweet_item_id IS NULL AND inventory_item_id IS NOT NULL)
    )
);

-- Indexes for order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_sweet_item_id ON order_items(sweet_item_id);
CREATE INDEX IF NOT EXISTS idx_order_items_inventory_item_id ON order_items(inventory_item_id);

-- ============================================================================
-- 6. TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sweet_items_updated_at ON sweet_items;
CREATE TRIGGER update_sweet_items_updated_at BEFORE UPDATE ON sweet_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_inventory_items_updated_at ON inventory_items;
CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON inventory_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. VIEWS
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
    COALESCE(SUM(oi.quantity), 0) AS total_items
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
