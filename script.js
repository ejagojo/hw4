/*
Name: Eljohn(EJ) Agojo
Date: 10/28/2024
File: script.js

GUI Assignment: 
    This assignment is about creating a web app that dynamically creates a multiplication table based on user input.
    This assignment served as a way to implement javascript basics and error handling.

Eljohn Agojo, UMass Lowell Computer Science, eljohn_agojo@student.uml.edu
Copyright (c) 2024 by Eljohn. All rights reserved. May be freely copied or 
excerpted for educational purposes with credit to the author.
*/

// Event listener 
const form_container = document.getElementById("form-container");

form_container.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form submission for validation

    // Retrieve input elements and values
    const min_col_input = document.getElementById("min_col_value");
    const max_col_input = document.getElementById("max_col_value");
    const min_row_input = document.getElementById("min_row_value");
    const max_row_input = document.getElementById("max_row_value");

    const min_col_input_val = parseInt(min_col_input.value);
    const max_col_input_val = parseInt(max_col_input.value);
    const min_row_input_val = parseInt(min_row_input.value);
    const max_row_input_val = parseInt(max_row_input.value);
    
    console.log("The minimum column input: " + min_col_input_val);
    console.log("The maximum column input: " + max_col_input_val);
    console.log("The minimum row input: " + min_row_input_val);
    console.log("The maximum row input: " + max_row_input_val);

    // Validate inputs and display error if necessary
    const validationResult = validateInputs(min_col_input_val, max_col_input_val, min_row_input_val, max_row_input_val);
    if (!validationResult.isValid) {
        displayError(validationResult.message);
        return;
    }

    // Clear any previous error messages if validation passes
    clearError();

    // Generate and display the multiplication table
    generateMultiplicationTable(min_col_input_val, max_col_input_val, min_row_input_val, max_row_input_val);
});

// Function to generate and display the multiplication table with animation
function generateMultiplicationTable(minCol, maxCol, minRow, maxRow) {
    // Get the table container
    const tableContainer = document.getElementById("table-container");

    // Remove existing table if it exists
    const existingTable = document.getElementById("multiplication-table");
    if (existingTable) existingTable.remove();

    // Create a new table element
    const table = document.createElement("table");
    table.id = "multiplication-table";

    // Create the header row with column values
    const headerRow = document.createElement("tr");
    const emptyHeaderCell = document.createElement("th");
    headerRow.appendChild(emptyHeaderCell); // Top-left empty corner cell

    // Populate the header with column values
    for (let col = minCol; col <= maxCol; col++) {
        const headerCell = document.createElement("th");
        headerCell.textContent = col;
        headerRow.appendChild(headerCell);
    }
    table.appendChild(headerRow);

    // Append the table to the table container before adding rows
    tableContainer.appendChild(table);

    // Generate table rows with animation
    let rowCount = 0;
    const animationDelay = 90; // The delay between rows (in milliseconds)

    for (let row = minRow; row <= maxRow; row++) {
        // Use closure to capture the current value of row
        (function (row) {
            setTimeout(() => {
                const tableRow = document.createElement("tr");

                // Row header
                const rowHeaderCell = document.createElement("th");
                rowHeaderCell.textContent = row;
                tableRow.appendChild(rowHeaderCell);

                // Populate cells
                for (let col = minCol; col <= maxCol; col++) {
                    const cell = document.createElement("td");
                    cell.textContent = row * col;
                    tableRow.appendChild(cell);
                }

                // Set initial opacity for animation
                tableRow.style.opacity = 0;

                // Append the row to the table
                table.appendChild(tableRow);

                // Trigger reflow
                void tableRow.offsetWidth;

                // Animate the row to fade in
                tableRow.style.transition = "opacity 0.5s ease";
                tableRow.style.opacity = 1;
            }, animationDelay * rowCount);
            rowCount++;
        })(row);
    }

    console.log("Voilaa");
}

// Checker for inputs -> valid - invalid
function validateInputs(minCol, maxCol, minRow, maxRow) {
    const min = -50;
    const max = 50;
    const fields = { minCol, maxCol, minRow, maxRow };

    // Check each value for valid number and range
    for (const [key, value] of Object.entries(fields)) {
        const numValue = Number(value);
        if (isNaN(numValue)) {
            return { isValid: false, message: `Invalid input: ${formatFieldName(key)} must be a number.` };
        }
        if (numValue < min || numValue > max) {
            return { isValid: false, message: `${formatFieldName(key)} must be between ${min} and ${max}.` };
        }
    }

    // Check that min values are less than or equal to max values
    if (minCol > maxCol) {
        return { isValid: false, message: `Minimum Column Value cannot be greater than Maximum Column Value.` };
    }
    if (minRow > maxRow) {
        return { isValid: false, message: `Minimum Row Value cannot be greater than Maximum Row Value.` };
    }

    return { isValid: true };
}

// Helper function to format field names for error messages
function formatFieldName(fieldName) {
    return fieldName
        .replace(/([A-Z])/g, ' $1')
        .replace('min', 'Minimum')
        .replace('max', 'Maximum')
        .replace('Col', 'Column')
        .replace('Row', 'Row')
        .trim();
}

// Display error message 
function displayError(message) {
    let errorElement = document.getElementById("error-message");
    if (!errorElement) {
        errorElement = document.createElement("p");
        errorElement.id = "error-message";
        errorElement.style.color = "red";
        errorElement.style.fontSize = "14px";
        form_container.insertAdjacentElement("beforebegin", errorElement); // Insert above the form
    }
    errorElement.textContent = message;
}

// Clear error message 
function clearError() {
    const errorElement = document.getElementById("error-message");
    if (errorElement) {
        errorElement.textContent = "";
    }
}