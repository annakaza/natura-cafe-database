-- natura_cafe_dml.sql: Planned Data Manipulation Language (DML) queries for Natura Cafe DBMS
-- Purpose: Outlines the DML queries (SELECT, INSERT, UPDATE, DELETE) designed during planning to 
--          support Natura Cafe's CRUD operations, showcasing SQL skills and database interaction 
--          strategy. These are implemented with dynamic values in app.js (Node.js).
-- Note: Uses placeholders (e.g., :nameInput) for demonstration; not an executable script.
--       See natura_cafe_schema.sql for schema definition and sample data.

--
-- CUSTOMERS Queries
--

-- READ: Retrieve all customers for display on the Customers page
SELECT * FROM Customers;

-- CREATE: Add a new customer to the Customers table
INSERT INTO Customers (name, email)
VALUES (:nameInput, :emailInput);

-- DELETE: Remove a customer from the Customers table
DELETE FROM Customers WHERE customerID = :customerID_selected_from_table;

--
-- EMPLOYEES Queries
--

-- READ: Retrieve all employees with role names for display on the Employees page
SELECT Employees.employeeID, Employees.name, Employees.address, Employees.phone,
       Employees.email, Employees.dateOfBirth, Employees.hireDate, Employees.payRate,
       Roles.name AS roleName
FROM Employees
INNER JOIN Roles ON Employees.roleID = Roles.roleID;

-- READ: Populate the Roles dropdown for adding/updating employees
SELECT roleID, name from Roles;

-- CREATE: Add a new employee to the Employees table
INSERT INTO Employees (name, address, phone, email, dateOfBirth, hireDate, payRate, roleID)
VALUES (:nameInput, :addressInput, :phoneInput, :emailInput, :dateOfBirthInput,
        :hireDateInput, :payRateInput, :roleID_from_dropdown_Input);

-- READ: Retrieve a single employee's data for the Update form
SELECT Employees.employeeID, Employees.name, Employees.address, Employees.phone,
       Employees.email, Employees.dateOfBirth, Employees.hireDate, Employees.payRate,
       Roles.name AS roleName
FROM Employees
INNER JOIN Roles ON Employees.roleID = Roles.roleID
WHERE employeeID = :employeeID_selected_from_table;

-- UPDATE: Modify an employee's role based on the Update Employee form
UPDATE Employees
SET roleID = roleID_from_dropdown_Input
WHERE employeeID= :employeeID_from_update_form;

-- READ: Search for employees by approximate name on the Employees page
SELECT * FROM Employees WHERE name = :approxNameInput;

-- READ: Populate the Employees dropdown for the Update form
SELECT employeeID, name FROM Employees;

-- DELETE: Remove an employee from the Employees table
DELETE FROM Employees WHERE employeeID = :employeeID_selected_from_table;

--
-- ROLES Queries
--

-- READ: Retrieve all roles for display on the Roles table
SELECT * FROM Roles;

-- CREATE: Add a new role to the Roles table
INSERT INTO Roles (name)
VALUES (:nameInput);

-- DELETE: Remove a role from the Roles table
DELETE FROM Roles WHERE roleID = :roleID_selected_from_table;

--
-- ITEMS Queries
--

-- READ: Retrieve all items for display on the Items table
SELECT * FROM Items;

-- CREATE: Add a new item to the Items table
INSERT INTO Items (name, price)
VALUES (:nameInput, :priceInput);

-- DELETE: Remove an item from the Items table
DELETE FROM Items WHERE itemID = :itemID_selected_from_table;

-- READ: Search for items by approximate name on the Items page
SELECT * FROM Items WHERE itemName = :approxItemName;

--
-- INVOICES Queries
--

-- READ: Retrieve all invoices with customer and employee names for display on the Invoices table
SELECT Invoices.invoiceID, Customers.name AS customerName, Employees.name AS employeeName,
       Invoices.saleDate, Invoices.netTotal, Invoices.salesTax, Invoices.saleTotal
FROM Invoices
INNER JOIN Customers ON Invoices.customerID = Customers.customerID
INNER JOIN Employees ON Invoices.employeeID = Employees.employeeID;

-- READ: Populate the Customers dropdown for the Add Invoice form
SELECT customerID, name from Customers;

-- READ: Populate the Employees dropdown for the Add Invoice form
SELECT employeeID, name from Employees;

-- CREATE: Add a new invoice to the Invoices table
INSERT INTO Invoices (customerID, employeeID, saleDate, netTotal, salesTax, saleTotal)
VALUES (:customerID_from_dropdown_Input, :employeeIDInput_from_dropdown_Input, :saleDateInput,
        :netTotalInput, :salesTaxInput, :saleTotalInput);

-- DELETE: Remove an invoice from the Invoices table
DELETE FROM Invoices WHERE invoiceID = :invoiceID_selected_from_table;

--
-- INVOICEITEMS Queries
--

-- READ: Retrieve all invoice items with item names and invoice dates for display on the InvoiceItems table
SELECT InvoiceItems.invoiceItemID, Items.name AS itemName, Invoices.saleDate, InvoiceItems.orderQuantity
FROM InvoiceItems
INNER JOIN Items ON InvoiceItems.itemID = Items.itemID
INNER JOIN Invoices ON InvoiceItems.invoiceID = Invoices.invoiceID;

-- READ: Populate the Items dropdown for Add and Update Invoice Item forms
SELECT itemID, name FROM Items;

-- READ: Populate the Invoices dropdown for Add and Update Invoice Item forms
SELECT invoiceID, saleDate FROM Invoices;

-- CREATE: Add a new invoice item to the InvoiceItems table
INSERT INTO InvoiceItems (itemID, invoiceID, orderQuantity)
VALUES (:itemID_from_dropdown_Input, :invoiceID_from_dropdown_Input, :orderQuantityInput);

-- READ: Retrieve a single invoice item’s data for the Update form
SELECT InvoiceItems.invoiceItemID, Items.name AS itemName, Invoices.saleDate, InvoiceItems.orderQuantity
FROM InvoiceItems
INNER JOIN Items ON InvoiceItems.itemID = Items.itemID
INNER JOIN Invoices ON InvoiceItems.invoiceID = Invoices.invoiceID
WHERE invoiceItemID = :invoiceItemID_selected_from_table;

-- UPDATE: Modify an invoice item’s order quantity based on the Update Invoice Item form
UPDATE InvoiceItems
SET orderQuantity = :orderQuantityInput 
WHERE invoiceItemID = :invoiceItemID_from_update_form;

-- DELETE: Remove an invoice item from the InvoiceItems table
DELETE FROM InvoiceItems WHERE invoiceItemID = :invoiceItemID_selected_from_table;