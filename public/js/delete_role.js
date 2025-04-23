// delete_role.js: Handles deleting roles via AJAX and removes them from the table dynamically

// Function to delete a role by ID
function deleteRole(roleID) {
    // Create a data object with the role ID to send to the server
    const data = {
        roleID: roleID
    };

    // Configure the AJAX request for deletion
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-role-ajax", true); // Matches route in app.js
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle the server's response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // On success, remove the row from the table
            deleteRow(roleID);
        } else if (xhttp.readyState == 4 && xhttp.status !=204) {
            // Log an error if the deletion fails
            console.log("Error: Unable to delete role with ID " + roleID)
        }
    };

    // Send the AJAX request with the role data
    xhttp.send(JSON.stringify(data));
}

// Function to remove a row from the roles table based on role ID
function deleteRow(roleID) {
    const table = document.getElementById("roles-table");

    // Iterate through table rows to find and delete the matching one
    for (let i = 0, row; row = table.rows[i]; i++)  {
        if (table.rows[i].getAttribute("data-value") == roleID) {
            table.deleteRow(i);
            break; // Exit loop after deletion
        }
    }
}