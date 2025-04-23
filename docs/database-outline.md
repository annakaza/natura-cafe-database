# Natura Cafe Database Outline

This document outlines the structure of the `natura_cafe` database, designed to manage operations for a cafe. The database powers a full-stack application, supporting customer, employee, role, invoice, and menu item management through efficient CRUD operations, with a focus on scalability and data integrity.

## Tables and Attributes

### Customers
Stores customer details for purchases.
- **customerID**: `INT`, Auto_increment, Not null, Primary key
- **name**: `VARCHAR(100)`, Not null
- **email**: `VARCHAR(100)`, Unique, Null
- **Relationships**:
  - One-to-Many with `Invoices` (via `customerID` as foreign key in `Invoices`).

### Employees
Stores employee information.
- **employeeID**: `INT`, Auto_increment, Not null, Primary key
- **name**: `VARCHAR(100)`, Not null
- **address**: `VARCHAR(100)`, Not null
- **phone**: `VARCHAR(100)`, Unique, Not null
- **email**: `VARCHAR(100)`, Unique, Not null
- **dateOfBirth**: `DATE`, Not null
- **hireDate**: `DATE`, Not null
- **payRate**: `DECIMAL(4,2)`, Not null
- **roleID**: `INT`, Null, Foreign key
- **Relationships**:
  - One-to-Many with `Invoices` (via `employeeID` as foreign key in `Invoices`).
  - Many-to-One with `Roles` (via `roleID` as foreign key in `Employees`).

### Roles
Stores employee role names.
- **roleID**: `INT`, Auto_increment, Not null, Primary key
- **name**: `VARCHAR(100)`, Unique, Not null
- **Relationships**:
  - One-to-Many with `Employees` (via `roleID` as foreign key in `Employees`).

### Items
Stores menu items and products.
- **itemID**: `INT`, Auto_increment, Not null, Primary key
- **name**: `VARCHAR(100)`, Unique, Not null
- **price**: `DECIMAL(5,2)`, Not null
- **Relationships**:
  - Many-to-Many with `Invoices` (via `InvoiceItems`, using `itemID` as foreign key).

### Invoices
Stores transaction details.
- **invoiceID**: `INT`, Auto_increment, Not null, Primary key
- **saleDate**: `DATETIME`, Not null
- **netTotal**: `DECIMAL(6,2)`, Not null
- **salesTax**: `DECIMAL(6,2)`, Not null
- **saleTotal**: `DECIMAL(6,2)`, Not null
- **employeeID**: `INT`, Null, Foreign key
- **customerID**: `INT`, Null, Foreign key
- **Relationships**:
  - Many-to-One with `Employees` (via `employeeID`).
  - Many-to-One with `Customers` (via `customerID`).
  - Many-to-Many with `Items` (via `InvoiceItems`, using `invoiceID` as foreign key).

### InvoiceItems
Intersection table for the Many-to-Many relationship between `Items` and `Invoices`.
- **invoiceItemID**: `INT`, Auto_increment, Not null, Primary key
- **itemID**: `INT`, Not null, Foreign key
- **invoiceID**: `INT`, Not null, Foreign key
- **orderQuantity**: `INT`, Not null

## Constraints
- **Nullable Foreign Keys**: `roleID` in `Employees`, `employeeID` and `customerID` in `Invoices` allow flexibility (e.g., invoices without assigned employees or customers).
- **Non-Nullable Foreign Keys**: `itemID` and `invoiceID` in `InvoiceItems` enforce data integrity for the M:N relationship.
- **Indexes**: Applied to foreign keys (e.g., `roleID`, `employeeID`) to optimize query performance.

## Notes
- The schema and sample data are implemented in `database/natura_cafe_schema.sql`.
- Planned DML queries (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) with placeholders are outlined in `database/natura_cafe_dml.sql`, demonstrating the database interaction strategy implemented dynamically in `app.js`.
- See `docs/erd.png` for the Entity-Relationship Diagram and `docs/schema.png` for the Schema Diagram visualizing table relationships.