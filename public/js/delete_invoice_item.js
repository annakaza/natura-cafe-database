// delete_invoice_item.js: Handles deleting invoice items via AJAX and updates the table and dropdown dynamically

// Function to delete an invoice item by ID
function deleteInvoiceItem(invoiceItemID) {
    // Create a data object with the invoice item ID to send to the server
    const data = {
        invoiceItemID: invoiceItemID
    };

    // Configure the AJAX request for deletion
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-invoice-item-ajax", true); // Matches route in app.js
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle the server's response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // On success, remove the row from the table
            deleteRow(invoiceItemID);
        } else if (xhttp.readyState == 4 && xhttp.status != 204) {
            // Log an error if the deletion fails
            console.log("Error: Unable to delete invoice item with ID " + invoiceItemID)
        }
    };

    // Send the AJAX request with the invoice item data
    xhttp.send(JSON.stringify(data));
}

// Function to remove a row from the invoice items table based on invoice item ID
function deleteRow(invoiceItemID){
    const table = document.getElementById("invoice-items-table");

    // Iterate through table rows to find and delete the matching one
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == invoiceItemID) {
            table.deleteRow(i);
            deleteDropDownMenu(invoiceItemID); // Update dropdown after row deletion
            break;                             // Exit loop after deletion
       }
    }
}

// Function to remove an invoice item from the update dropdown menu
function deleteDropDownMenu(invoiceItemID){
    const selectMenu = document.getElementById("selected-invoice-item");

    // Iterate through dropdown options to find and remove the matching one
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(invoiceItemID)){
        selectMenu[i].remove();
        break; // Exit loop after removal
      } 
    }
  }