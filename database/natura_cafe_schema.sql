-- Natura Cafe Sales and Operations Management System
-- Schema Definition File (natura_cafe_schema.sql)
-- Purpose: MySQL schema of 6 tables, 1 M:N relationship (Invoices-Items via InvoiceItems),
--          nullable and non-nullable FKs, cascading rules, and sample data.
-- Note: Overwrites natura_cafe database with sample data; uses UTC for saleDate;
--       run with `mysql -u youruser -p < database/natura_cafe_schema.sql`.

SET time_zone = "+00:00";   -- Sets session time zone to UTC for consistent saleDate values
SET FOREIGN_KEY_CHECKS = 0; -- Disables FK checks during setup to allow flexible table creation order

-- --------------------------------------------------------

-- Drop and recreate the database to start fresh with sample data
DROP DATABASE IF EXISTS natura_cafe;
CREATE DATABASE natura_cafe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; -- Uses modern UTF-8 encoding
USE natura_cafe;

-- --------------------------------------------------------

-- Table: Customers
-- Stores customer details for sales tracking
CREATE OR REPLACE TABLE `Customers` (
  `customerID` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) DEFAULT NULL UNIQUE  -- Optional unique email
);

-- Sample data: Demonstrates optional email with a NULL value
INSERT INTO `Customers` (`customerID`, `name`, `email`) VALUES
(1, 'Clair Hugo', 'c_hugo@gmail.com'),
(2, 'Dylan Warren', 'warren47@hotmail.com'),
(3, 'Zoya Rollins', 'zoyarollins@yahoo.com'),
(4, 'Sebastian Pham', NULL),
(5, 'Darcey Savage', 'darsavage@gmail.com');

-- --------------------------------------------------------

-- Table: Roles
-- Defines employee roles for assignment in Employees
CREATE OR REPLACE TABLE `Roles` (
  `roleID` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE
);

-- Sample data: Provides roles referenced by Employees
INSERT INTO `Roles` (`roleID`, `name`) VALUES
(1, 'Manager'),
(2, 'Barista'),
(3, 'Custodian');

-- --------------------------------------------------------

-- Table: Employees
-- Tracks employee details with an optional role assignment
CREATE OR REPLACE TABLE `Employees` (
  `employeeID` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `address` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `dateOfBirth` DATE NOT NULL,
  `hireDate` DATE NOT NULL,
  `payRate` DECIMAL(4,2) NOT NULL,
  `roleID` INT(11) DEFAULT NULL,  -- Nullable FK; can be unassigned
  FOREIGN KEY (`roleID`) REFERENCES `Roles`(`roleID`) ON DELETE SET NULL -- Sets roleID to NULL if role is deleted
);

-- Index: Enhances lookup speed on roleID (optional for performance)
CREATE INDEX IF NOT EXISTS idx_roleID ON Employees(roleID);

-- Sample data: Includes a NULL roleID to show optional assignment
INSERT INTO `Employees` (`employeeID`, `name`, `address`, `phone`, `email`, `dateOfBirth`, `hireDate`, `payRate`, `roleID`) VALUES
(1, 'David Martinez', '789 Oak St, Orlando, FL', '321-555-9012', 'david.martinez@natura.com', '1988-11-03', '2021-05-20', 25.00, 1),
(2, 'Emily Carter', '101 Maple St, Orlando, FL', '321-555-3456', 'emily.carter@natura.com', '1992-07-14', '2022-10-30', 24.00, 1),
(3, 'James Rodriguez', '22 Pine St, Orlando, FL', '407-555-7890', 'james.rodriguez@natura.com', '1998-03-18', '2023-06-05', 17.00, NULL),
(4, 'Sarah Johnson', '456 Elm St, Orlando, FL', '407-555-5678', 'sarah.johnson@natura.com', '1995-09-25', '2023-01-10', 18.00, 2),
(5, 'Michael Lee', '123 Main St, Orlando, FL', '407-555-1234', 'michael.lee@natura.com', '1986-05-12', '2022-08-15', 16.00, 3);

-- --------------------------------------------------------

-- Table: Items
-- Lists menu items available for purchase
CREATE OR REPLACE TABLE `Items` (
  `itemID` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `price` DECIMAL(5,2) NOT NULL
);

-- Sample data: Represents cafe menu items
INSERT INTO `Items` (`itemID`, `name`, `price`) VALUES
(1, 'Parisian Blend', 2.00),
(2, 'Cappuccino', 4.00),
(3, 'Cafe Au Lait', 4.00),
(4, 'Latte', 5.00),
(5, 'Earl Grey Tea', 1.50);

-- --------------------------------------------------------

-- Table: Invoices
-- Records sales transactions with optional employee/customer links
CREATE OR REPLACE TABLE `Invoices` (
  `invoiceID` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `saleDate` DATETIME NOT NULL,
  `netTotal` DECIMAL(6,2) NOT NULL,
  `salesTax` DECIMAL(6,2) NOT NULL,
  `saleTotal` DECIMAL(6,2) NOT NULL,
  `employeeID` INT(11) DEFAULT NULL,  -- Nullable FK; can be unassigned
  `customerID` INT(11) DEFAULT NULL,  -- Nullable FK; can be unassigned
  FOREIGN KEY (`employeeID`) REFERENCES `Employees`(`employeeID`) ON DELETE SET NULL, -- Sets employeeID to NULL if employee is deleted
  FOREIGN KEY (`customerID`) REFERENCES `Customers`(`customerID`) ON DELETE SET NULL  -- Sets customerID to NULL if customer is deleted
);

-- Indexes: Enhance query speed on nullable FKs (optional for performance)
CREATE INDEX IF NOT EXISTS idx_employeeID ON Invoices(employeeID);
CREATE INDEX IF NOT EXISTS idx_customerID ON Invoices(customerID);

-- Sample data: Includes NULL FKs to show optional employee/customer assignment
INSERT INTO `Invoices` (`invoiceID`, `saleDate`, `netTotal`, `salesTax`, `saleTotal`, `employeeID`, `customerID`) VALUES
(1, '2023-08-01 08:30:20', 9.00, 0.54, 9.54, NULL, 1),
(2, '2023-08-01 10:45:07', 6.50, 0.39, 6.89, 4, 3),
(3, '2023-08-02 09:10:03', 8.00, 0.48, 8.48, 3, NULL),
(4, '2023-08-02 14:45:57', 3.50, 0.21, 3.71, 2, 2),
(5, '2023-08-02 17:20:31', 13.00, 0.78, 13.78, 3, 3);

-- --------------------------------------------------------

-- Table: InvoiceItems
-- Links Invoices and Items in a many-to-many relationship
CREATE OR REPLACE TABLE `InvoiceItems` (
  `invoiceItemID` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `itemID` INT(11) NOT NULL,    -- Non-nullable FK; required for M:N link
  `invoiceID` INT(11) NOT NULL, -- Non-nullable FK; required for M:N link
  `orderQuantity` INT(11) NOT NULL,
  FOREIGN KEY (`itemID`) REFERENCES `Items` (`itemID`) ON DELETE CASCADE,         -- Deletes invoice items if item is removed
  FOREIGN KEY (`invoiceID`) REFERENCES `Invoices` (`invoiceID`) ON DELETE CASCADE -- Deletes invoice items if invoice is removed
);

-- Indexes: Enhance M:N lookup speed (optional for performance)
CREATE INDEX IF NOT EXISTS idx_itemID ON InvoiceItems(itemID);
CREATE INDEX IF NOT EXISTS idx_invoiceID ON InvoiceItems(invoiceID);

-- Sample data: Demonstrates the M:N relationship between Invoices and Items
INSERT INTO `InvoiceItems` (`invoiceItemID`, `itemID`, `invoiceID`, `orderQuantity`) VALUES
(1, 2, 1, 1),
(2, 4, 1, 1),
(3, 4, 2, 1),
(4, 5, 2, 1),
(5, 2, 3, 1),
(6, 3, 3, 1),
(7, 5, 4, 1),
(8, 1, 4, 1),
(9, 5, 5, 2),
(10, 4, 5, 2);

-- --------------------------------------------------------

-- Re-enable foreign key checks after setup
SET FOREIGN_KEY_CHECKS = 1;