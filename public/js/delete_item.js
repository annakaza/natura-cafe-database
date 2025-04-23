// delete_item.js: Handles deleting menu items via AJAX and removes them from the table dynamically

// Function to delete an item by ID
function deleteItem(itemID) {
    // Create a data object with the item ID to send to the server
    const data = {
        itemID: itemID
    };

    // Configure the AJAX request for deletion
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-item-ajax", true); // Matches route in app.js
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle the server's response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // On success (204 No Content), remove the row from the table
            deleteRow(itemID);
        } else if (xhttp.readyState == 4 && xhttp.status != 204) {
            // Log an error if the deletion fails
            console.log("Error: Unable to delete item with ID " + itemID)
        }
    };

    // Send the AJAX request with the item data
    xhttp.send(JSON.stringify(data));
}

// Function to remove a row from the items table based on item ID
function deleteRow(itemID){

    const table = document.getElementById("items-table");

    // Iterate through table rows to find and delete the matching one
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == itemID) {
            table.deleteRow(i);
            break; // Exit loop after deletion
       }
    }
}