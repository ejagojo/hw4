/*
Name: Eljohn(EJ) Agojo
Date: 11/10/2024
File: script.js

GUI Assignment:
    This assignment is about creating a web app that dynamically creates a multiplication table based on user input.
    This assignment served as a way to implement JavaScript basics and error handling. Now adding to the table generation
    We implemented jQuery for more powerful error handling and used jQuery UI plugin for implementing a slider for our input
    values

Eljohn Agojo, UMass Lowell Computer Science, eljohn_agojo@student.uml.edu
Copyright (c) 2024 by Eljohn. All rights reserved. May be freely copied or 
excerpted for educational purposes with credit to the author.
*/

$(document).ready(function () {
    console.log("Document is ready, setting up validation and sliders...");

    // Initialize jQuery UI Tabs
    $("#tabs").tabs();

    // Define the range for sliders and inputs
    const minRange = -50;
    const maxRange = 50;

    // Initialize Sliders with two-way binding and value display
    function initializeSliders() {
        const sliders = [
            { slider: "#min_col_slider", input: "#min_col_value" },
            { slider: "#max_col_slider", input: "#max_col_value" },
            { slider: "#min_row_slider", input: "#min_row_value" },
            { slider: "#max_row_slider", input: "#max_row_value" },
        ];

        sliders.forEach(({ slider, input }) => {
            $(slider).slider({
                min: minRange,
                max: maxRange,
                value: 0,
                create: function () {
                    $(this)
                        .find(".ui-slider-handle")
                        .append(`<span class="slider-value">${$(this).slider("value")}</span>`);
                },
                slide: function (event, ui) {
                    $(input).val(ui.value);
                    $(this).find(".slider-value").text(ui.value);
                    if ($("#form-container").valid()) {
                        generateTable();
                    }
                }
            });
        });

        // Sync sliders and inputs
        sliders.forEach(({ slider, input }) => {
            $(input).on("input", function () {
                const value = parseInt($(this).val()) || 0;
                $(slider).slider("value", value);
                $(slider).find(".slider-value").text(value);
                if ($("#form-container").valid()) {
                    generateTable();
                }
            });
        });
    }

    // Initialize validation on the form
    $("#form-container").validate({
        rules: {
            minimum_col_value: {
                required: true,
                number: true,
                range: [minRange, maxRange]
            },
            max_col_value: {
                required: true,
                number: true,
                range: [minRange, maxRange],
                greaterThanOrEqual: "#min_col_value"
            },
            min_row_value: {
                required: true,
                number: true,
                range: [minRange, maxRange]
            },
            max_row_value: {
                required: true,
                number: true,
                range: [minRange, maxRange],
                greaterThanOrEqual: "#min_row_value"
            }
        },
        messages: {
            minimum_col_value: {
                required: "Minimum Column Value is required",
                number: "Please enter a valid number",
                range: `Value must be between ${minRange} and ${maxRange}`
            },
            max_col_value: {
                required: "Maximum Column Value is required",
                number: "Please enter a valid number",
                greaterThanOrEqual: "Maximum Column Value cannot be less than Minimum Column Value",
                range: `Value must be between ${minRange} and ${maxRange}`
            },
            min_row_value: {
                required: "Minimum Row Value is required",
                number: "Please enter a valid number",
                range: `Value must be between ${minRange} and ${maxRange}`
            },
            max_row_value: {
                required: "Maximum Row Value is required",
                number: "Please enter a valid number",
                greaterThanOrEqual: "Maximum Row Value cannot be less than Minimum Row Value",
                range: `Value must be between ${minRange} and ${maxRange}`
            }
        },
        errorPlacement: function (error, element) {
            error.addClass("error-message"); // Apply custom styling class
            error.insertAfter(element.parent());
        },
    });

    $.validator.addMethod("greaterThanOrEqual", function (value, element, param) {
        return parseFloat(value) >= parseFloat($(param).val());
    }, "Value must be greater than or equal to {0}");

// Function to generate the multiplication table with animation
function generateTable() {
    const minCol = parseInt($("#min_col_value").val());
    const maxCol = parseInt($("#max_col_value").val());
    const minRow = parseInt($("#min_row_value").val());
    const maxRow = parseInt($("#max_row_value").val());

    console.log("Generating table with inputs:", { minCol, maxCol, minRow, maxRow });

    // Clear any existing table
    $("#table-container").empty();

    // Create the table element
    const table = $("<table>").attr("id", "multiplication-table");

    // Create the header row
    const headerRow = $("<tr>");
    headerRow.append($("<th>")); // Top-left empty cell
    for (let col = minCol; col <= maxCol; col++) {
        const th = $("<th>").text(col);
        headerRow.append(th);
    }
    table.append(headerRow);

    // Append the table to the container before adding rows
    const tableContainer = $("<div>").addClass("table-container");
    tableContainer.append(table);
    $("#table-container").append(tableContainer);

    // Animate rows
    let rowCount = 0;
    const animationDelay = 100; // Delay between rows in milliseconds

    for (let row = minRow; row <= maxRow; row++) {
        // Use closure to capture the current value of 'row'
        (function (row) {
            setTimeout(function () {
                const tableRow = $("<tr>");

                // Row header
                const rowHeaderCell = $("<th>").text(row);
                tableRow.append(rowHeaderCell);

                // Populate cells
                for (let col = minCol; col <= maxCol; col++) {
                    const cell = $("<td>").text(row * col);
                    tableRow.append(cell);
                }

                // Append the row to the table
                table.append(tableRow);

                // Trigger reflow and set opacity to 1
                tableRow[0].offsetWidth; // Trigger reflow
                tableRow.css("opacity", "1"); // Start the fade-in animation
            }, animationDelay * rowCount);
            rowCount++;
        })(row);
    }
}


    // Function to create a new tab with the generated table
    function createTab() {
        const minCol = parseInt($("#min_col_value").val());
        const maxCol = parseInt($("#max_col_value").val());
        const minRow = parseInt($("#min_row_value").val());
        const maxRow = parseInt($("#max_row_value").val());

        const tabId = `tab-${Date.now()}`;
        const tabLabel = `[${minCol}, ${maxCol}] x [${minRow}, ${maxRow}]`;

        $("#tabs ul").append(
            `<li><a href="#${tabId}">${tabLabel}</a><span class="ui-icon ui-icon-close">Remove Tab</span></li>`
        );
        $("#tabs").append(`<div id="${tabId}">${generateTableForTab(minCol, maxCol, minRow, maxRow)}</div>`);
        $("#tabs").tabs("refresh").tabs("option", "active", -1);
    }

    function generateTableForTab(minCol, maxCol, minRow, maxRow) {
        const table = $("<table>").attr("id", "multiplication-table");
        const headerRow = $("<tr>").append($("<th>"));
        for (let col = minCol; col <= maxCol; col++) {
            headerRow.append($("<th>").text(col));
        }
        table.append(headerRow);

        for (let row = minRow; row <= maxRow; row++) {
            const tableRow = $("<tr>");
            tableRow.append($("<th>").text(row));
            for (let col = minCol; col <= maxCol; col++) {
                tableRow.append($("<td>").text(row * col));
            }
            table.append(tableRow);
        }

        return $("<div>").addClass("table-container").append(table);
    }

    $("#tabs").on("click", "span.ui-icon-close", function () {
        const panelId = $(this).closest("li").remove().attr("aria-controls");
        $("#" + panelId).remove();
        $("#tabs").tabs("refresh");
    });

    $("#delete-tabs-button").click(function () {
        $(".delete-tab-checkbox:checked").each(function () {
            const tabId = $(this).data("tab-id");
            const tabAnchor = $(`#tabs a[href='${tabId}']`);
            tabAnchor.closest("li").remove();
            $(tabId).remove();
        });
        $("#tabs").tabs("refresh");
    });

    initializeSliders();

    if ($("#form-container").valid()) {
        generateTable();
    }
});
