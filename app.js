/*
 * Natura Cafe Sales and Operations Management System
 * Main Application File (app.js)
 * Description:
 *  - Express.js server for a full-stack CRUD application connected to a MySQL database.
 *  - Handles routes for Customers, Employees, Roles, Items, Invoices, and InvoiceItems.
 *  - Supports filtering, insertion, deletion, and updating via AJAX and Handlebars templating.
 *  - Backend logic includes foreign key handling, dynamic dropdowns, and cascading deletes.
 *
 * Technologies Used:
 *  - Node.js, Express.js, Handlebars.js (for dynamic HTML templating)
 *  - MySQL + custom schema
 *  - CSS for styling, JavaScript (including AJAX) for front-end interactions
 *
 * To run locally:
 *  1. Clone the repository
 *  2. Run `npm install`
 *  3. Configure database credentials in 'db-connector.js'
 *  4. Start MySQL server and load the database schema using `mysql -u youruser -p < database/natura_cafe_schema.sql`
 *  5. Run `node app.js` or `npm start` to start the server
 *  6. Open your browser and go to `http://localhost:2037`
 */

/*
    SETUP
*/
const express = require('express');
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
const PORT = 2037;

// Database
const db = require('./database/db-connector')

const { engine } = require('express-handlebars');
app.engine('.hbs', engine({extname: ".hbs"}));
app.set('view engine', '.hbs');


/*
    ROUTES
*/
// HOME PAGE
app.get('/', (req, res) => {
    res.render('index');
});

// --------------------------------------------------------
// CUSTOMERS PAGE
/** 
 * GET /customers: Display all customers or filter by name if a search query is provided
 */
app.get('/customers', function(req, res)
    {  
    let query1;

    // If no search query, select all customers
    if (!req.query.name) {
        query1 = `SELECT * FROM Customers;`;
    } else {
        // Filter by name if search query exists
        query1 = `SELECT * FROM Customers WHERE name LIKE "${req.query.name}%";`;
    }

    db.pool.query(query1, (error, rows) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.render('customers', { data: rows });
        }
    });
});

/**
 * POST /add-customer-ajax: Add a new customer via AJAX
 */
app.post('/add-customer-ajax', (req, res) => {
    const data = req.body;
    const email = data.email ? `'${data.email}'` : 'NULL';

    const query1 = `INSERT INTO Customers (name, email) VALUES ('${data.name}', ${email});`;

    db.pool.query(query1, (error) => {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            const query2 = `SELECT * FROM Customers;`;
            db.pool.query(query2, (error, rows) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

/**
 * DELETE /delete-customer-ajax: Remove a customer by ID via AJAX
 */
app.delete('/delete-customer-ajax', (req,res) => {
    const data = req.body;
    const customerID = parseInt(data.customerID);
    const deleteQuery = `DELETE FROM Customers WHERE customerID = ?`;

    db.pool.query(deleteQuery, [customerID], (error) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});
        
// --------------------------------------------------------
// EMPLOYEES PAGE
/**
 * GET /employees: Display all employees or filter by name, including role details
 */
app.get('/employees', (req, res) => {
    let query1;

    // If there is no query string, perform a basic SELECT
    if (!req.query.name) {
        query1 = `SELECT employeeID, name, address, phone, email,
                  DATE_FORMAT(dateOfBirth, '%m/%d/%Y') AS dateOfBirth,
                  DATE_FORMAT(hireDate, '%m/%d/%Y') AS hireDate,
                  payRate, roleID FROM Employees;`;
    } else {
        // If there is a query string, filter employees by name
        query1 = `SELECT employeeID, name, address, phone, email,
                  DATE_FORMAT(dateOfBirth, '%m/%d/%Y') AS dateOfBirth,
                  DATE_FORMAT(hireDate, '%m/%d/%Y') AS hireDate,
                  payRate, roleID FROM Employees
                  WHERE name LIKE "${req.query.name}%";`;
    }

    const query2 = "SELECT * FROM Roles;";

    // Run the first query to fetch employees
    db.pool.query(query1, (error, rows) => {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }

        // Save the employees
        let employees = rows;
        
        // Run the second query to fetch roles
        db.pool.query(query2, (error, rows) => {
            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }

            // Save the roles
            let roles = rows;

            // Create a role map for quick lookups
            let roleMap = {};
            roles.forEach(role => {
                let roleID = parseInt(role.roleID, 10);
                roleMap[roleID] = role.name;
            });

            // Map employees to include role names based on roleID
            employees = employees.map(employee => {
                return Object.assign(employee, { roleID: roleMap[employee.roleID] });
            });

            // Render the employees page with the updated data
            res.render('employees', { data: employees, roles: roles });
        });
    });
});

/**
 * POST /add-employee-ajax: Add a new employee via AJAX
 */
app.post('/add-employee-ajax', (req, res) => {
    const data = req.body;
    const roleID = data.roleID ? parseInt(data.roleID) : null;
    const payRate = parseFloat(data.payRate);

    query1 = `INSERT INTO Employees (name, address, phone, email, dateOfBirth, hireDate, payRate, roleID)
              VALUES ('${data.name}', '${data.address}', '${data.phone}', '${data.email}', '${data.dateOfBirth}', '${data.hireDate}', ${payRate}, ${roleID});`;

    db.pool.query(query1, (error) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            const query2 = `SELECT employeeID, name, address, phone, email,
                            DATE_FORMAT(dateOfBirth, '%m/%d/%Y') AS dateOfBirth,
                            DATE_FORMAT(hireDate, '%m/%d/%Y') AS hireDate,
                            payRate, roleID FROM Employees;`;
            db.pool.query(query2, (error, rows) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

/**
 * DELETE /delete-employee-ajax: Remove an employee by ID via AJAX
 */
app.delete('/delete-employee-ajax', (req,res) => {
    const data = req.body;
    const employeeID = parseInt(data.employeeID);
    const deleteQuery= `DELETE FROM Employees WHERE employeeID = ?`;

    db.pool.query(deleteQuery, [employeeID], (error) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

/**
 * PUT /put-employee-ajax: Update an employee's role via AJAX
 */
app.put('/put-employee-ajax', (req,res) => {
    const data = req.body;
    const employeeID = parseInt(data.employeeID);
    const roleID = data.roleID ? parseInt(data.roleID) : null;

    const queryUpdateEmployee = `UPDATE Employees SET roleID = ? WHERE employeeID = ?`;
    const selectRole = `SELECT * FROM Roles WHERE roleID = ?`

    db.pool.query(queryUpdateEmployee, [roleID, employeeID], (error) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(selectRole, [roleID], (error, rows) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

// --------------------------------------------------------
// ROLES PAGE
/**
 * GET /roles: Display all roles
 */
app.get('/roles', (req, res) => {
    const query1 = `SELECT * FROM Roles ORDER BY roleID ASC;`;

    db.pool.query(query1, (error, rows) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.render('roles', { data: rows });
        }
    });
});

/**
 * POST /add-role-ajax: Add a new role via AJAX
 */
app.post('/add-role-ajax', (req, res) => {
    const data = req.body;
    const query1 = `INSERT INTO Roles (name) VALUES ('${data.name}');`;
    
    db.pool.query(query1, (error) => {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            const query2 = `SELECT * FROM Roles ORDER BY roleID ASC;;`;
            db.pool.query(query2, (error, rows) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

/**
 * DELETE /delete-role-ajax: Remove a role by ID via AJAX
 */
app.delete('/delete-role-ajax', (req, res) => {
    const data = req.body;
    const roleID = parseInt(data.roleID);
    const deleteQuery = `DELETE FROM Roles WHERE roleID = ?`;

    db.pool.query(deleteQuery, [roleID], (error) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

// --------------------------------------------------------
// ITEMS PAGE
/**
 * GET /items: Display all items or filter by name if a search query is provided
 */
app.get('/items', (req, res) => {
    let query1;

    if (!req.query.name) {
        query1 = `SELECT * FROM Items;`;
    } else {
        query1 = `SELECT * FROM Items WHERE name LIKE "${req.query.name}%";`;
    }

    db.pool.query(query1, (error, rows) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.render('items', { data: rows });
        }
    });
});

/**
 * POST /add-item-ajax: Add a new item via AJAX
 */
app.post('/add-item-ajax', (req, res) => {
    const data = req.body;
    const price = parseFloat(data.price);

    const query1 = `INSERT INTO Items (name, price) VALUES ('${data.name}', ${data.price});`;

    db.pool.query(query1, (error) => {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            const query2 = `SELECT * FROM Items;`;
            db.pool.query(query2, (error, rows) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

/**
 * DELETE /delete-item-ajax: Remove an item by ID via AJAX
 */
app.delete('/delete-item-ajax', (req,res) => {
    const data = req.body;
    const itemID = parseInt(data.itemID);
    const deleteQuery= `DELETE FROM Items WHERE itemID = ?`;

    db.pool.query(deleteQuery, [itemID], (error) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

// --------------------------------------------------------
// INVOICES PAGE
/**
 * GET /invoices: Display all invoices with employee and customer names
 */
app.get('/invoices', (req, res) => {
    const query1 = `SELECT invoiceID, DATE_FORMAT(Invoices.saleDate, '%Y-%m-%d %H:%i:%s') AS saleDate, netTotal, salesTax, saleTotal, employeeID, customerID FROM Invoices;`;
    const query2 = `SELECT * FROM Employees;`;
    const query3 = `SELECT * FROM Customers;`;

    db.pool.query(query1, (error, rows) => {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }

        // Save the invoices
        let invoices = rows;

        // Run the second query to fetch employees
        db.pool.query(query2, (error, rows) => {
            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }

            // Save the employees
            let employees = rows;

            // Create an employee map for quick lookups
            let employeeMap = {}
            employees.forEach(employee => {
                let employeeID = parseInt(employee.employeeID, 10);
                employeeMap[employeeID] = employee.name;
            });

            // Run the third query to fetch customers
            db.pool.query(query3, (error, rows) => {
                if (error) {
                    console.log(error);
                    return res.sendStatus(400);
                }

                // Save the customers
                let customers = rows;

                // Create an customer map for quick lookups
                let customerMap = {}
                customers.forEach(customer => {
                    let customerID = parseInt(customer.customerID, 10);
                    customerMap[customerID] = customer.name;
                });

                // Map invoices to include employee & customer names based on ID
                invoices = invoices.map(invoice => {
                    return Object.assign(invoice, { customerID: customerMap[invoice.customerID] }, { employeeID: employeeMap[invoice.employeeID] });
                });
                
                // Render the invoices page with the updated data
                res.render('invoices', { data: invoices, employees: employees, customers: customers });
            });
        });
    });
});

/**
 * POST /add-invoice-ajax: Add a new invoice via AJAX
 */
app.post('/add-invoice-ajax', (req, res) => {
    const data = req.body;
    const customerID = data.customerID ? parseInt(data.customerID) : null;
    const employeeID = data.employeeID ? parseInt(data.employeeID) : null;
    const netTotal = parseFloat(data.netTotal);
    const salesTax = netTotal * 0.06         // Compute salesTax
    const saleTotal = netTotal + salesTax    // Compute saleTotal

    const query1 = `INSERT INTO Invoices (saleDate, netTotal, salesTax, saleTotal, employeeID, customerID)
                    VALUES ('${data.saleDate}', ${netTotal}, ${salesTax}, ${saleTotal}, ${employeeID}, ${customerID});`;

    db.pool.query(query1, (error) => {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            const query2 = `SELECT * FROM Invoices;`;
            db.pool.query(query2, (error, rows) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

/**
 * DELETE /delete-invoice-ajax: Remove an invoice and its items by ID via AJAX
 */
app.delete('/delete-invoice-ajax', (req,res) => {
    const data = req.body;
    const invoiceID = parseInt(data.invoiceID);
    const deleteInvoice = `DELETE FROM Invoices WHERE invoiceID = ?`;
    const deleteInvoiceItem = `DELETE FROM InvoiceItems WHERE invoiceID = ?`;

    db.pool.query(deleteInvoice, [invoiceID], (error) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(deleteInvoiceItem, [invoiceID], (error) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            });
        }
    });
});

// --------------------------------------------------------
// INVOICE ITEMS PAGE
/**
 * GET /invoice_items: Display all invoice items with item and invoice details
 */
app.get('/invoice_items', (req, res) => {
    const query1 = `SELECT * FROM InvoiceItems;`;
    const query2 = `SELECT * FROM Items;`;
    const query3 = `SELECT invoiceID, DATE_FORMAT(saleDate, '%Y-%m-%d %H:%i:%s') AS saleDate FROM Invoices;`;

    db.pool.query(query1, (error, rows) => {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }
        
        // Save the invoice items
        let invoice_items = rows;
        
        // Run the second query to fetch items
        db.pool.query(query2, (error, rows) => {
            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }
            
            // Save the items
            let items = rows;

            // Create an item map for quick lookups
            let itemMap = {}
            items.forEach(item => {
                let itemID = parseInt(item.itemID, 10);
                itemMap[itemID] = item.name;
            });

            // Run the third query to fetch invoices
            db.pool.query(query3, (error, rows) => {
                if (error) {
                    console.log(error);
                    return res.sendStatus(400);
                }
            
                // Save the invoices
                let invoices = rows;

                // Create an invoice map for quick lookups
                let invoiceMap = {}
                invoices.forEach(invoice => {
                    let invoiceID = parseInt(invoice.invoiceID, 10);
                    invoiceMap[invoiceID] = invoice.saleDate;
                });

                // Map invoice items to include item name & invoice date based on ID
                invoice_items = invoice_items.map(invoice_item => {
                    return Object.assign(invoice_item, { itemID: itemMap[invoice_item.itemID]}, {invoiceID: invoiceMap[invoice_item.invoiceID] });
                });

                // Render the invoice items page with the updated data
                return res.render('invoice_items', { data: invoice_items, items: items, invoices: invoices });                
            });
        });
    });
});

/**
 * POST /add-invoice-item-ajax: Add a new invoice item via AJAX
 */
app.post('/add-invoice-item-ajax', (req, res) => {
    const data = req.body;
    const itemID = parseInt(data.itemID);
    const invoiceID = parseInt(data.invoiceID);
    const orderQuantity = parseInt(data.orderQuantity);

    const query1 = `INSERT INTO InvoiceItems (itemID, invoiceID, orderQuantity) VALUES (${itemID}, ${invoiceID}, ${orderQuantity});`;
    
    db.pool.query(query1, (error) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            const query2 = `SELECT * FROM InvoiceItems;`;
            db.pool.query(query2, (error, rows) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

/**
 * DELETE /delete-invoice-item-ajax: Remove an invoice item by ID via AJAX
 */
app.delete('/delete-invoice-item-ajax', (req, res) => {
    const data = req.body;
    const invoiceItemID = parseInt(data.invoiceItemID);
    const deleteQuery= `DELETE FROM InvoiceItems WHERE invoiceItemID = ?`;

    db.pool.query(deleteQuery, [invoiceItemID], (error) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

/**
 * PUT /put-invoice-item-ajax: Update an invoice item's order quantity via AJAX
 */
app.put('/put-invoice-item-ajax', (req, res) => {
    const data = req.body;
    const invoiceItemID = parseInt(data.invoiceItemID);
    const orderQuantity = parseInt(data.orderQuantity);

    const queryUpdate = `UPDATE InvoiceItems SET orderQuantity = ? WHERE invoiceItemID = ?`;
    const querySelect = `SELECT * FROM InvoiceItems WHERE invoiceItemID = ?`

    db.pool.query(queryUpdate, [orderQuantity, invoiceItemID], (error) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(querySelect, [invoiceItemID], (error, rows) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});


/*
    LISTENER
*/
app.listen(PORT, () => {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});