// update_invoice_item.js: Handles updating invoice item quantities via AJAX and refreshes the table dynamically

// Retrieve the form element for updating invoice items
const updateInvoiceItemForm = document.getElementById('update-invoice-item-form-ajax');

// Add an event listener to handle form submission
updateInvoiceItemForm.addEventListener("submit", function (e) {
    // Prevent default form submission to enable AJAX handling
    e.preventDefault();

    // Get references to form input fields
    const inputInvoiceItem = document.getElementById("selected-invoice-item");
    const inputOrderQuantity = document.getElementById("input-order-quantity-update");

    // Extract values from the input fields
    const invoiceItemValue = inputInvoiceItem.value; // invoiceItemID from the dropdown
    const orderQuantityValue = inputOrderQuantity.value;

    // Create a data object to send to the server
    const data = {
        invoiceItemID: invoiceItemValue,
        orderQuantity: orderQuantityValue
    };

    // Configure the AJAX request for updating
    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-invoice-item-ajax", true); // Matches route in app.js
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle the server's response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // On success, update the row in the table with the new quantity
            updateRow(xhttp.response, invoiceItemValue);
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            // Log an error if the update fails
            console.log("Error: Unable to update invoice item with ID " + invoiceItemValue)
        }
    };

    // Send the AJAX request with the invoice item data
    xhttp.send(JSON.stringify(data));
});

// Function to update a row in the invoice items table with the new quantity data
function updateRow(data, invoiceItemID) {
    const parsedData = JSON.parse(data);
    const table = document.getElementById("invoice-items-table");

    // Iterate through table rows to find and update the matching one
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == invoiceItemID) {
            // Get the order quantity cell (index 3 based on invoice_items.hbs structure)
            const td = row.getElementsByTagName("td")[3];

            // Update the order quantity cell with the new value
            td.innerHTML = parsedData[0].orderQuantity;
            break; // Exit loop after update
        }
    }
}