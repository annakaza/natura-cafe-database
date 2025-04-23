// update_employee.js: Handles updating employee roles via AJAX and refreshes the table dynamically

// Retrieve the form element for updating employees
const updateEmployeeForm = document.getElementById('update-employee-form-ajax');

// Add an event listener to handle form submission
updateEmployeeForm.addEventListener("submit", function (e) {
    // Prevent default form submission to enable AJAX handling
    e.preventDefault();

    // Get references to form input fields
    const inputName = document.getElementById("selected-name");
    const inputRole = document.getElementById("input-role-id-update");

    // Extract values from the input fields
    const nameValue = inputName.value; // employeeID associated with name selected from the dropdown
    let roleValue = inputRole.value;

    // Create a data object to send to the server
    const data = {
        employeeID: nameValue,
        roleID: roleValue
    }

    // Configure the AJAX request for updating
    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-employee-ajax", true); // Matches route in app.js
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle the server's response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // On success, update the row in the table with the new role
            updateRow(xhttp.response, nameValue);
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            // Log an error if the update fails
            console.log("Error: Unable to update employee role for ID " + nameValue)
        }
    };

    // Send the AJAX request with the employee data
    xhttp.send(JSON.stringify(data));
});

// Function to update a row in the employees table with the new role data
function updateRow(data, employeeID){
    const parsedData = JSON.parse(data);
    const table = document.getElementById("employees-table");

    // Iterate through table rows to find and update the matching one
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == employeeID) {
            // Get the role cell (index 8 based on employees.hbs structure)
            const td = row.getElementsByTagName("td")[8];

            // Update the role cell with the new value or blank if null
            if (parsedData[0]) {                   // Check if a role was selected
                td.innerHTML = parsedData[0].name; // Display the role name
            } else {
                td.innerHTML = "";                 // Display empty field if roleID is null
            }
            break; // Exit loop after update
       }
    }
}