// delete_employee.js: Handles deleting employees via AJAX and updates the table and dropdown dynamically

// Function to delete an employee by ID
function deleteEmployee(employeeID) {
    // Create a data object with the employee ID to send to the server
    const data = {
        employeeID: employeeID
    };

    // Configure the AJAX request for deletion
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-employee-ajax", true); // Matches route in app.js
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle the server's response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // On success, remove the row from the table
            deleteRow(employeeID);
        } else if (xhttp.readyState == 4 && xhttp.status != 204) {
            // Log an error if the deletion fails
            console.log("Error: Unable to delete employee with ID " + employeeID)
        }
    };

    // Send the AJAX request with the employee data
    xhttp.send(JSON.stringify(data));
}

// Function to remove a row from the employees table based on employee ID
function deleteRow(employeeID){
    const table = document.getElementById("employees-table");

    // Function to remove a row from the employees table based on employee ID
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == employeeID) {
            table.deleteRow(i);
            deleteDropDownMenu(employeeID); // Update dropdown after row deletion
            break;                          // Exit loop after deletion
       }
    }
}

// Function to remove an employee from the update dropdown menu
function deleteDropDownMenu(employeeID){
    let selectMenu = document.getElementById("selected-name");

    // Iterate through dropdown options to find and remove the matching one
    for (let i = 0; i < selectMenu.length; i++) {
      if (Number(selectMenu.options[i].value) === Number(employeeID)) {
        selectMenu[i].remove();
        break; // Exit loop after removal
      } 
    }
  }