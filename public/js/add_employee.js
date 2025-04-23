// add_employee.js: Handles adding new employees via AJAX and updates the table dynamically

// Retrieve the form element for adding employees
const addEmployeeForm = document.getElementById('add-employee-form-ajax');

// Add an event listener to handle form submission
addEmployeeForm.addEventListener("submit", function (e) {
    // Prevent default form submission to enable AJAX handling
    e.preventDefault();

    // Get references to form input fields
    const inputName = document.getElementById("input-name");
    const inputAddress = document.getElementById("input-address");
    const inputPhone = document.getElementById("input-phone");
    const inputEmail = document.getElementById("input-email");
    const inputBirthDate = document.getElementById("input-birth-date");
    const inputStartDate = document.getElementById("input-start-date");
    const inputPayRate = document.getElementById("input-pay-rate");
    const inputRoleID = document.getElementById("input-role-id");

    // Extract values from the input fields
    const nameValue = inputName.value;
    const addressValue = inputAddress.value;
    const phoneValue = inputPhone.value;
    const emailValue = inputEmail.value;
    const birthDateValue = inputBirthDate.value;
    const startDateValue = inputStartDate.value;
    const payRateValue = inputPayRate.value;
    const roleIDValue = inputRoleID.value;

    // Get the selected role name from the dropdown
    let roleName = inputRoleID.options[inputRoleID.selectedIndex].text;

    // Clear name for optional field when placeholder is selected
    if (roleIDValue == "") {
            roleName = "";
        };

    // Create a data object to send to the server
    const data = {
        name: nameValue,
        address: addressValue,
        phone: phoneValue,
        email: emailValue,
        dateOfBirth: birthDateValue,
        hireDate: startDateValue,
        payRate: payRateValue,
        roleID: roleIDValue
    };
    
    // Configure the AJAX request
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-employee-ajax", true); // Matches route in app.js
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle the server's response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // On success, add the new employee to the table and reset the form
            addRowToTable(xhttp.response, roleName);
            inputName.value = '';
            inputAddress.value = '';
            inputPhone.value = '';
            inputEmail.value = '';
            inputBirthDate.value = '';
            inputStartDate.value = '';
            inputPayRate.value = '';
            inputRoleID.value = '';
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            // Log an error message if the request fails
            console.log("Error: Unable to add employee due to invalid input or server issue.")
        }
    };

    // Send the AJAX request with the employee data
    xhttp.send(JSON.stringify(data));
});

// Function to add a new row to the employees table with the server's response data
const addRowToTable = (data, roleName) => {
    // Get reference to the employees table
    const currentTable = document.getElementById("employees-table");

    // Parse the server response to access the latest employee
    const parsedData = JSON.parse(data);
    const newRow = parsedData[parsedData.length - 1];

    // Create a new table row and cells
    const row = document.createElement("TR");
    const idCell = document.createElement("TD");
    const nameCell = document.createElement("TD");
    const addressCell = document.createElement("TD");
    const phoneCell = document.createElement("TD");
    const emailCell = document.createElement("TD");
    const dateOfBirthCell = document.createElement("TD");
    const hireDateCell = document.createElement("TD");
    const payRateCell = document.createElement("TD");
    const roleCell = document.createElement("TD");
    const deleteCell = document.createElement("TD");

    // Populate cells with data from the new employee
    idCell.innerText = newRow.employeeID;
    idCell.style.textAlign = "right";   // Aligns ID right, consistent with table styling
    nameCell.innerText = newRow.name;
    addressCell.innerText = newRow.address;
    phoneCell.innerText = newRow.phone;
    emailCell.innerText = newRow.email;
    dateOfBirthCell.innerText = newRow.dateOfBirth;
    hireDateCell.innerText = newRow.hireDate;
    payRateCell.innerText = newRow.payRate;
    payRateCell.style.textAlign = "right";  // Aligns pay rate right, matching table format
    roleCell.innerText = roleName;  // Displays role name instead of ID

    // Create and configure the delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.classList.add("delete-button");                    // Applies consistent styling
    deleteButton.onclick = () => deleteEmployee(newRow.employeeID); // Calls delete function with employee ID
    deleteCell.appendChild(deleteButton);                           // Add button to the cell

    // Append cells to the row
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(addressCell);
    row.appendChild(phoneCell);
    row.appendChild(emailCell);
    row.appendChild(dateOfBirthCell);
    row.appendChild(hireDateCell);
    row.appendChild(payRateCell);
    row.appendChild(roleCell);
    row.appendChild(deleteCell);

    // Set a data attribute for identifying the row
    row.setAttribute('data-value', newRow.employeeID);

    // Add the row to the table
    currentTable.appendChild(row);

    // Update the dropdown menu for role updates without requiring a page refresh
    const selectMenu = document.getElementById("selected-name");
    const option = document.createElement("option");
    option.text = newRow.name;
    option.value = newRow.employeeID;
    selectMenu.add(option);
};