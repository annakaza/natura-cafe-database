// delete_invoice.js: Handles deleting invoices via AJAX and removes them from the table dynamically

// Function to delete an invoice by ID
function deleteInvoice(invoiceID) {
    // Create a data object with the invoice ID to send to the server
    const data = {
        invoiceID: invoiceID
    };

    // Configure the AJAX request for deletion
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-invoice-ajax", true); // Matches route in app.js
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle the server's response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // On success, remove the row from the table
            deleteRow(invoiceID);
        } else if (xhttp.readyState == 4 && xhttp.status != 204) {
            // Log an error if the deletion fails
            console.log("Error: Unable to delete invoice with ID " + invoiceID)
        } 
    };

    // Send the AJAX request with the invoice data
    xhttp.send(JSON.stringify(data));
}

// Function to remove a row from the invoices table based on invoice ID
function deleteRow(invoiceID) {
    const table = document.getElementById("invoices-table");

    // Iterate through table rows to find and delete the matching one
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == invoiceID) {
            table.deleteRow(i);
            break; // Exit loop after deletion
        }
    }
}