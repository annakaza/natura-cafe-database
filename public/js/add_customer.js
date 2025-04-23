// add_customer.js: Handles adding new customers via AJAX and updates the table dynamically

// Retrieve the form element for adding customers
const addCustomerForm = document.getElementById('add-customer-form-ajax');

// Add an event listener to handle form submission
addCustomerForm.addEventListener("submit", function (e) {
    // Prevent default form submission to enable AJAX handling
    e.preventDefault();

    // Get references to form input fields
    const inputName = document.getElementById("input-name");
    const inputEmail = document.getElementById("input-email");

    // Extract values from the input fields
    const nameValue = inputName.value;
    let emailValue = inputEmail.value;

    // Convert empty email to null for optional field handling
    if (emailValue == "") {
        emailValue = null;
    }

    // Create a data object to send to the server
    let data = {
        name: nameValue,
        email: emailValue
    };
    
    // Configure the AJAX request
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-customer-ajax", true); // Matches route in app.js
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle the server's response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // On success, add the new customer to the table and reset the form
            addRowToTable(xhttp.response);
            inputName.value = '';
            inputEmail.value = '';
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            // Log an error message if the request fails
            console.log("Error: Unable to add customer due to invalid input or server issue.")
        }
    };

    // Send the AJAX request with the customer data
    xhttp.send(JSON.stringify(data));
});

// Function to add a new row to the customers table with the server's response data
const addRowToTable = (data) => {
    // Get reference to the customers table
    const currentTable = document.getElementById("customers-table");

    // Parse the server response to access the latest customer
    const parsedData = JSON.parse(data);
    const newRow = parsedData[parsedData.length - 1];

    // Create a new table row and cells
    const row = document.createElement("TR");
    const idCell = document.createElement("TD");
    const nameCell = document.createElement("TD");
    const emailCell = document.createElement("TD");
    const deleteCell = document.createElement("TD");


    // Populate cells with data from the new customer
    idCell.innerText = newRow.customerID;
    idCell.style.textAlign = "right";   // Aligns ID right, consistent with table styling
    nameCell.innerText = newRow.name;
    emailCell.innerText = newRow.email;

    // Create and configure the delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.classList.add("delete-button");                    // Applies consistent styling
    deleteButton.onclick = () => deleteCustomer(newRow.customerID); // Calls delete function with customer ID
    deleteCell.appendChild(deleteButton);                           // Add button to the cell

    // Append cells to the row
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(emailCell);
    row.appendChild(deleteCell);

    // Set a data attribute for identifying the row
    row.setAttribute('data-value', newRow.customerID);

    // Add the row to the table
    currentTable.appendChild(row);
};