// delete_customer.js: Handles deleting customers via AJAX and removes them from the table dynamically

// Function to delete a customer by ID
function deleteCustomer(customerID) {
    // Create a data object with the customer ID to send to the server
    const data = {
        customerID: customerID
    };

    // Configure the AJAX request for deletion
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-customer-ajax", true); // Matches route in app.js
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle the server's response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // On success, remove the row from the table
            deleteRow(customerID);
        } else if (xhttp.readyState == 4 && xhttp.status != 204) {
            // Log an error if the deletion fails
            console.log("Error: Unable to delete customer with ID " + customerID)
        }
    };

    // Send the AJAX request with the customer data
    xhttp.send(JSON.stringify(data));
}

// Function to remove a row from the customers table based on customer ID
function deleteRow(customerID){
    const table = document.getElementById("customers-table");

    // Iterate through table rows to find and delete the matching one
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == customerID) {
            table.deleteRow(i);
            break; // Exit loop after deletion
       }
    }
}
