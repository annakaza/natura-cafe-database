// add_item.js: Handles adding new menu items via AJAX and updates the table dynamically

// Retrieve the form element for adding items
const addItemForm = document.getElementById('add-item-form-ajax');

// Add an event listener to handle form submission
addItemForm.addEventListener("submit", function (e) {
    // Prevent default form submission to enable AJAX handling
    e.preventDefault();

    // Get references to form input fields
    const inputName = document.getElementById("input-name");
    const inputPrice = document.getElementById("input-price");

    // Extract values from the input fields
    const nameValue = inputName.value;
    const priceValue = inputPrice.value;

    // Create a data object to send to the server
    const data = {
        name: nameValue,
        price: priceValue
    };
    
    // Configure the AJAX request
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-item-ajax", true); // Matches route in app.js
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle the server's response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // On success, add the new item to the table and reset the form
            addRowToTable(xhttp.response);
            inputName.value = '';
            inputPrice.value = '';
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            // Log an error message if the request fails
            console.log("Error: Unable to add item due to invalid input or server issue.")
        }
    };

    // Send the AJAX request with the item data
    xhttp.send(JSON.stringify(data));
});

// Function to add a new row to the items table with the server's response data
const addRowToTable = (data) => {
    // Get reference to the items table
    const currentTable = document.getElementById("items-table");

    // Parse the server response to access the latest item
    const parsedData = JSON.parse(data);
    const newRow = parsedData[parsedData.length - 1];

    // Create a new table row and cells
    const row = document.createElement("TR");
    const idCell = document.createElement("TD");
    const nameCell = document.createElement("TD");
    const priceCell = document.createElement("TD");
    const deleteCell = document.createElement("TD");
    
    // Populate cells with data from the new item
    idCell.innerText = newRow.itemID;
    idCell.style.textAlign = "right";       // Aligns ID right, consistent with table styling
    nameCell.innerText = newRow.name;
    priceCell.innerText = newRow.price;
    priceCell.style.textAlign = "right";    // Aligns price right, matching table format

    // Create and configure the delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.classList.add("delete-button");            // Applies consistent styling
    deleteButton.onclick = () => deleteItem(newRow.itemID); // Calls delete function with item ID
    deleteCell.appendChild(deleteButton);                   // Add button to the cell

    // Append cells to the row
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(priceCell);
    row.appendChild(deleteCell);

    // Set a data attribute for identifying the row
    row.setAttribute('data-value', newRow.itemID);

    // Add the row to the table
    currentTable.appendChild(row);
};