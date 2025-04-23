// add_invoice.js: Handles adding new invoices via AJAX and updates the table dynamically

// Retrieve the form element for adding invoices
const addInvoiceForm = document.getElementById('add-invoices-form-ajax');

// Add an event listener to handle form submission
addInvoiceForm.addEventListener("submit", function (e) {
    // Prevent default form submission to enable AJAX handling
    e.preventDefault();

    // Get references to form input fields
    const inputSaleDate = document.getElementById("input-saledate");
    const inputNetTotal = document.getElementById("input-net-total");
    const inputEmployeeID = document.getElementById("input-employee-id");
    const inputCustomerID = document.getElementById("input-customer-id");

    // Get the values from the form fields
    const saleDateValue = inputSaleDate.value;
    const netTotalValue = inputNetTotal.value;
    const salesTaxValue = String(parseInt(netTotalValue) * .06); // Calculate sales tax (6% of net total)
    const saleTotalValue = String(parseInt(netTotalValue) + parseInt(salesTaxValue)); // Calculate total including tax
    const employeeIDValue = inputEmployeeID.value;
    const customerIDValue = inputCustomerID.value;

    // Get the selected employee and customer names from the dropdowns
    let employeeName = inputEmployeeID.options[inputEmployeeID.selectedIndex].text;
    let customerName = inputCustomerID.options[inputCustomerID.selectedIndex].text;

    // Clear names for optional fields when placeholder is selected
    if (employeeIDValue == "") {
        employeeName = "";
    };
    if (customerIDValue == "") {
        customerName = "";
    };

    // Create a data object to send to the server
    const data = {
        saleDate: saleDateValue,
        netTotal: netTotalValue,
        salesTax: salesTaxValue,
        saleTotal: saleTotalValue,
        employeeID: employeeIDValue,
        customerID: customerIDValue
    };

    // Configure the AJAX request
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-invoice-ajax", true);  // Matches route in app.js
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle the server's response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // On success, add the new invoice to the table and reset the form
            addRowToTable(xhttp.response, employeeName, customerName);
            inputSaleDate.value = '';
            inputNetTotal.value = '';
            inputEmployeeID.value = '';
            inputCustomerID.value = '';
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            // Log an error message if the request fails
            console.log("Error: Unable to add invoice due to invalid input or server issue.")
        }
    };

    // Send the AJAX request with the invoice data
    xhttp.send(JSON.stringify(data));
});


// Function to add a new row to the invoices table with the server's response data
const addRowToTable = (data, employeeName, customerName) => {
    // Get reference to the invoices table
    const currentTable = document.getElementById("invoices-table");

    // Parse the server response to access the latest invoice
    const parsedData = JSON.parse(data);
    const newRow = parsedData[parsedData.length - 1];

    // Create a new table row and cells
    const row = document.createElement("TR");
    const idCell = document.createElement("TD");
    const saleDateCell = document.createElement("TD");
    const netTotalCell = document.createElement("TD");
    const salesTaxCell = document.createElement("TD");
    const saleTotalCell = document.createElement("TD");
    const employeeCell = document.createElement("TD");
    const customerCell = document.createElement("TD");
    const deleteCell = document.createElement("TD");

    // Format the sale date to match Handlebars display (YYYY-MM-DD HH:MM:SS)
    const formattedSaleDate = new Date(newRow.saleDate).toISOString().slice(0, 19).replace('T', ' ');

    // Populate cells with data from the new invoice
    idCell.innerText = newRow.invoiceID;
    idCell.style.textAlign = "right";         // Aligns ID right, consistent with table styling
    saleDateCell.innerText = formattedSaleDate;
    netTotalCell.innerText = newRow.netTotal;
    netTotalCell.style.textAlign = "right";   // Aligns net total right, matching table format
    salesTaxCell.innerText = newRow.salesTax;
    salesTaxCell.style.textAlign = "right";   // Aligns sales tax right, matching table format
    saleTotalCell.innerText = newRow.saleTotal;
    saleTotalCell.style.textAlign = "right";  // Aligns sale total right, matching table format
    employeeCell.innerText = employeeName;    // Displays employee name instead of ID
    customerCell.innerText = customerName;    // Displays customer name instead of ID

    // Create and configure the delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.classList.add("delete-button");                    // Applies consistent styling
    deleteButton.onclick = () => deleteInvoice(newRow.invoiceID);   // Calls delete function with invoice ID
    deleteCell.appendChild(deleteButton);                           // Add button to the cell

    // Append cells to the row
    row.appendChild(idCell);
    row.appendChild(saleDateCell);
    row.appendChild(netTotalCell);
    row.appendChild(salesTaxCell);
    row.appendChild(saleTotalCell);
    row.appendChild(employeeCell);
    row.appendChild(customerCell);
    row.appendChild(deleteCell);

    // Set a data attribute for identifying the row
    row.setAttribute('data-value', newRow.invoiceID);

    // Add the row to the table
    currentTable.appendChild(row);
};