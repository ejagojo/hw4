$(document).ready(function () {
    console.log("Document is ready, setting up validation...");

    // Initialize jQuery Validation on the form
    $("#form-container").validate({
        rules: {
            minimum_col_value: {
                required: true,
                number: true
            },
            max_col_value: {
                required: true,
                number: true,
                greaterThanOrEqual: "#min_col_value"  // Custom rule for max_col_value >= min_col_value
            },
            min_row_value: {
                required: true,
                number: true
            },
            max_row_value: {
                required: true,
                number: true,
                greaterThanOrEqual: "#min_row_value"  // Custom rule for max_row_value >= min_row_value
            }
        },
        messages: {
            minimum_col_value: {
                required: "Minimum Column Value is required",
                number: "Please enter a valid number"
            },
            max_col_value: {
                required: "Maximum Column Value is required",
                number: "Please enter a valid number",
                greaterThanOrEqual: "Maximum Column Value cannot be less than Minimum Column Value"
            },
            min_row_value: {
                required: "Minimum Row Value is required",
                number: "Please enter a valid number"
            },
            max_row_value: {
                required: "Maximum Row Value is required",
                number: "Please enter a valid number",
                greaterThanOrEqual: "Maximum Row Value cannot be less than Minimum Row Value"
            }
        },
        errorPlacement: function (error, element) {
            console.log("Error message generated for:", element.attr("id"));
            error.addClass("error-message"); // Apply custom styling class
            error.insertAfter(element.parent());
        },
        submitHandler: function () {
            console.log("Submit Handler Triggered - Validation Passed");
            generateTable();
        }
    });

    // Custom validator for ensuring max values are greater than or equal to min values
    $.validator.addMethod("greaterThanOrEqual", function(value, element, param) {
        return parseFloat(value) >= parseFloat($(param).val());
    }, "Value must be greater than or equal to {0}");

    // Table generation function with debug logging and animation
    function generateTable() {
        const minCol = parseInt($("#min_col_value").val());
        const maxCol = parseInt($("#max_col_value").val());
        const minRow = parseInt($("#min_row_value").val());
        const maxRow = parseInt($("#max_row_value").val());

        console.log("Inputs:", { minCol, maxCol, minRow, maxRow });

        const tableContainer = $("#table-container");
        tableContainer.empty();

        const table = $("<table>").attr("id", "multiplication-table");
        const headerRow = $("<tr>");
        headerRow.append($("<th>")); // Top-left empty cell
        for (let col = minCol; col <= maxCol; col++) {
            headerRow.append($("<th>").text(col));
        }
        table.append(headerRow);

        let rowCount = 0;
        const animationDelay = 100;

        for (let row = minRow; row <= maxRow; row++) {
            (function (currentRow) {
                setTimeout(() => {
                    const tableRow = $("<tr>");
                    tableRow.append($("<th>").text(currentRow));

                    for (let col = minCol; col <= maxCol; col++) {
                        tableRow.append($("<td>").text(currentRow * col));
                    }

                    tableRow.css("opacity", 0);
                    table.append(tableRow);
                    tableRow.animate({ opacity: 1 }, 500);
                }, animationDelay * rowCount);
                rowCount++;
            })(row);
        }
        tableContainer.append(table);
    }
});
