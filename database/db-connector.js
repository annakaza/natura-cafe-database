// Import MySQL module for database connectivity
const mysql = require('mysql');

// Create a connection pool using the provided credentials
const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',      // Database host (local server)
    user            : 'your_username',  // MySQL username (replace with your own)
    password        : 'your_password',  // MySQL password (replace with your own)
    database        : 'natura_cafe',    // Target database created by natura_cafe_schema.sql
    timezone        : '+00:00'          // Ensures UTC consistency with schema’s saleDate
});

// Export the pool for use across the application
module.exports.pool = pool;