# Database Schema Documentation

## 📁 Files in This Directory

1. **`database_schema.sql`** - Complete SQL schema with all tables, indexes, constraints, triggers, and views
2. **`DATABASE_DESIGN.md`** - Comprehensive design document with ERD, table specifications, and design decisions
3. **`ERD_DIAGRAM.txt`** - Visual text-based Entity Relationship Diagram
4. **`QUICK_REFERENCE.md`** - Quick reference guide for common queries and patterns
5. **`../migration/V2__create_complete_schema.sql`** - Flyway-compatible migration script

## 🎯 Design Overview

The database schema is designed for a **Sweet Shop Management System** with the following core entities:

1. **Users** - Authentication and authorization
2. **Sweet Items** - Product catalog (no inventory tracking)
3. **Inventory Items** - Stock management (with quantity)
4. **Orders** - Customer orders
5. **Order Items** - Individual items within orders (recommended)

## 🔍 Key Design Decisions

### 1. Separate Sweet Items and Inventory Items
**Current:** Two separate tables  
**Reason:** Allows different use cases:
- `sweet_items`: Product catalog (what's available)
- `inventory_items`: Stock management (how many available)

**Future Options:**
- Merge into single table with `quantity` column
- Add foreign key relationship between them
- Keep separate (current approach)

### 2. Order Items Table (Recommended)
**Status:** Currently missing in codebase  
**Purpose:** Proper order management with line items  
**Benefits:**
- Multiple items per order
- Historical price preservation
- Better order tracking

### 3. User-Order Relationship
**Current:** Only `customer_name` (string)  
**Recommended:** Add `user_id` foreign key  
**Benefits:**
- User order history
- Better data integrity
- Performance (indexed lookups)

## 📊 Current vs Recommended Schema

### Current Schema (Minimal)
```
users
sweet_items
inventory_items
orders (customer_name only, no user_id)
```

### Recommended Schema (Production-Ready)
```
users
sweet_items
inventory_items
orders (with user_id FK and status)
order_items (NEW - for proper order management)
```

## 🚀 Migration Path

1. **Phase 1:** Current schema (already exists)
2. **Phase 2:** Add `user_id` to orders + create `order_items` table
3. **Phase 3:** Add `status` column to orders
4. **Phase 4:** Future enhancements (soft delete, audit columns, etc.)

## 📝 Usage

### To Apply Schema:

**Option 1: Using Flyway**
```bash
# Place V2__create_complete_schema.sql in db/migration/
# Flyway will automatically apply it
```

**Option 2: Manual Execution**
```bash
psql -U sweetshop_user -d sweetshop -f database_schema.sql
```

**Option 3: JPA Auto-DDL**
```properties
# In application.properties
spring.jpa.hibernate.ddl-auto=update
# Hibernate will create tables automatically (not recommended for production)
```

## ✅ Production Checklist

- [x] All tables defined
- [x] Primary keys on all tables
- [x] Foreign keys for relationships
- [x] Indexes for performance
- [x] Constraints for data integrity
- [x] Triggers for timestamps
- [x] Views for common queries
- [ ] `order_items` table (recommended)
- [ ] `user_id` FK in orders (recommended)
- [ ] Order status column (recommended)

## 📚 Related Documentation

- See `DATABASE_DESIGN.md` for detailed specifications
- See `QUICK_REFERENCE.md` for common queries
- See `ERD_DIAGRAM.txt` for visual representation

---

**Generated:** Based on complete codebase analysis  
**Database:** PostgreSQL 12+  
**ORM:** JPA/Hibernate (Spring Boot 3.x)
