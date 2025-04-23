// add_role.js: Handles adding new roles via AJAX and updates the table dynamically

// Retrieve the form element for adding roles
let addRoleForm = document.getElementById('add-role-form-ajax');

// Add an event listener to handle form submission
addRoleForm.addEventListener("submit", function (e) {
    // Prevent default form submission to enable AJAX handling
    e.preventDefault();

    // Get reference to the form input field
    const inputName = document.getElementById("input-name");

    // Extract value from the input field
    const nameValue = inputName.value;

    // Create a data object to send to the server
    const data = {
        name: nameValue
    };

    // Configure the AJAX request
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-role-ajax", true); // Matches route in app.js
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle the server's response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // On success, add the new role to the table and reset the form
            addRowToTable(xhttp.response);
            inputName.value = '';
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            // Log an error message if the request fails
            console.log("Error: Unable to add role due to invalid input or server issue.")
        }
    };

    // Send the AJAX request with the role data
    xhttp.send(JSON.stringify(data));
});

// Function to add a new row to the roles table with the server's response data
const addRowToTable = (data) => {
    // Get reference to the roles table
    const currentTable = document.getElementById("roles-table");

    // Parse the server response to access the latest role
    const parsedData = JSON.parse(data);
    const newRow = parsedData[parsedData.length - 1];

    // Create a row and 3 cells
    const row = document.createElement("TR");
    const idCell = document.createElement("TD");
    const nameCell = document.createElement("TD");
    const deleteCell = document.createElement("TD");

    // Populate cells with data from the new role
    idCell.innerText = newRow.roleID;
    idCell.style.textAlign = "right";   // Aligns ID right, consistent with table styling
    nameCell.innerText = newRow.name;

    // Create and configure the delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.classList.add("delete-button"); // Applies consistent styling
    deleteButton.onclick = () => deleteRole(newRow.roleID); // Calls delete function with role ID
    deleteCell.appendChild(deleteButton); // Add button to the cell

    // Append cells to the row
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(deleteCell);

    // Set a data attribute for identifying the row
    row.setAttribute('data-value', newRow.roleID);

    // Add the row to the table
    currentTable.appendChild(row);
};