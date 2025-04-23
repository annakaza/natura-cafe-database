// add_invoice_item.js: Handles adding new invoice items via AJAX and updates the table dynamically

// Retrieve the form element for adding invoice items
const addInvoiceItemForm = document.getElementById('add-invoice-item-form-ajax');

// Add an event listener to handle form submission
addInvoiceItemForm.addEventListener("submit", function (e) {
    // Prevent default form submission to enable AJAX handling
    e.preventDefault();

    // Get references to form input fields
    const inputItemID = document.getElementById("input-item-id");
    const inputInvoiceID = document.getElementById("input-invoice-id");
    const inputOrderQuantity = document.getElementById("input-order-quantity");

    // Extract values from the input fields
    const itemIDValue = inputItemID.value;
    const invoiceIDValue = inputInvoiceID.value;
    const orderQuantityValue = inputOrderQuantity.value;

    // Get the selected item name and invoice sale date from the dropdowns
    const itemName = inputItemID.options[inputItemID.selectedIndex].text;
    const invoiceSaleDate = inputInvoiceID.options[inputInvoiceID.selectedIndex].text;

    // Create a data object to send to the server
    const data = {
        itemID: itemIDValue,
        invoiceID: invoiceIDValue,
        orderQuantity: orderQuantityValue
    };

    // Configure the AJAX request
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-invoice-item-ajax", true); // Matches route in app.js
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle the server's response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // On success, add the new invoice item to the table and reset the form
            addRowToTable(xhttp.response, itemName, invoiceSaleDate);
            inputItemID.value = '';
            inputInvoiceID.value = '';
            inputOrderQuantity.value = '';
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            // Log an error message if the request fails
            console.log("Error: Unable to add invoice item due to invalid input or server issue.")
        }
    };

    // Send the AJAX request with the invoice item data
    xhttp.send(JSON.stringify(data));
});

// Function to add a new row to the invoice items table with the server's response data
const addRowToTable = (data, itemName, invoiceSaleDate) => {
    // Get reference to the invoice items table
    const currentTable = document.getElementById("invoice-items-table");

    // Parse the server response to access the latest invoice item
    const parsedData = JSON.parse(data);
    const newRow = parsedData[parsedData.length - 1]

    // Create a new table row and cells
    const row = document.createElement("TR");
    const idCell = document.createElement("TD");
    const itemCell = document.createElement("TD");
    const invoiceCell = document.createElement("TD");
    const orderQuantityCell = document.createElement("TD");
    const deleteCell = document.createElement("TD");

    // Populate cells with data from the new invoice item
    idCell.innerText = newRow.invoiceItemID;
    idCell.style.textAlign = "right";            // Aligns ID right, consistent with table styling
    itemCell.innerText = itemName;               // Displays item name instead of ID
    invoiceCell.innerText = invoiceSaleDate;     // Displays sale date instead of invoice ID
    orderQuantityCell.innerText = newRow.orderQuantity;          
    orderQuantityCell.style.textAlign = "right"; // Aligns quantity right, matching table format

    // Create and configure the delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.classList.add("delete-button");                          // Applies consistent styling
    deleteButton.onclick = () => deleteInvoiceItem(newRow.invoiceItemID); // Calls delete function with invoice item ID
    deleteCell.appendChild(deleteButton);                                 // Add button to the cell

    // Append cells to the row
    row.appendChild(idCell);
    row.appendChild(itemCell);
    row.appendChild(invoiceCell);
    row.appendChild(orderQuantityCell);
    row.appendChild(deleteCell);

    // Set a data attribute for identifying the row
    row.setAttribute('data-value', newRow.invoiceItemID);

    // Add the row to the table
    currentTable.appendChild(row);

    // Update the dropdown menu for quantity updates without requiring a page refresh
    let selectMenu = document.getElementById("selected-invoice-item");
    let option = document.createElement("option");
    option.text = itemName + " / " + invoiceSaleDate; // Concatenates for display clarity
    option.value = newRow.invoiceItemID;
    selectMenu.add(option);
};