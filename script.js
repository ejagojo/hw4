/*
Name: Eljohn(EJ) Agojo
Date: 10/28/2024
File: script.js

GUI Assignment:
    This assignment is about creating a web app that dynamically creates a multiplication table based on user input.
    This assignment served as a way to implement JavaScript basics and error handling.

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
        // Minimum Column Value Slider
        $("#min_col_slider").slider({
            min: minRange,
            max: maxRange,
            value: 0,
            create: function () {
                // Append a span to display the value on the handle
                $(this).find('.ui-slider-handle').append(`<span class="slider-value">${$(this).slider("value")}</span>`);
            },
            slide: function (event, ui) {
                $("#min_col_value").val(ui.value).trigger("input");
                $(this).find('.slider-value').text(ui.value); // Update the handle value display
            }
        });

        // Maximum Column Value Slider
        $("#max_col_slider").slider({
            min: minRange,
            max: maxRange,
            value: 0,
            create: function () {
                $(this).find('.ui-slider-handle').append(`<span class="slider-value">${$(this).slider("value")}</span>`);
            },
            slide: function (event, ui) {
                $("#max_col_value").val(ui.value).trigger("input");
                $(this).find('.slider-value').text(ui.value);
            }
        });

        // Minimum Row Value Slider
        $("#min_row_slider").slider({
            min: minRange,
            max: maxRange,
            value: 0,
            create: function () {
                $(this).find('.ui-slider-handle').append(`<span class="slider-value">${$(this).slider("value")}</span>`);
            },
            slide: function (event, ui) {
                $("#min_row_value").val(ui.value).trigger("input");
                $(this).find('.slider-value').text(ui.value);
            }
        });

        // Maximum Row Value Slider
        $("#max_row_slider").slider({
            min: minRange,
            max: maxRange,
            value: 0,
            create: function () {
                $(this).find('.ui-slider-handle').append(`<span class="slider-value">${$(this).slider("value")}</span>`);
            },
            slide: function (event, ui) {
                $("#max_row_value").val(ui.value).trigger("input");
                $(this).find('.slider-value').text(ui.value);
            }
        });

        // Input fields update sliders and generate table
        $("#min_col_value").on("input", function () {
            const value = parseInt($(this).val()) || 0;
            $("#min_col_slider").slider("value", value);
            $("#min_col_slider").find('.slider-value').text(value);
            if ($("#form-container").valid()) {
                generateTable();
            }
        });

        $("#max_col_value").on("input", function () {
            const value = parseInt($(this).val()) || 0;
            $("#max_col_slider").slider("value", value);
            $("#max_col_slider").find('.slider-value').text(value);
            if ($("#form-container").valid()) {
                generateTable();
            }
        });

        $("#min_row_value").on("input", function () {
            const value = parseInt($(this).val()) || 0;
            $("#min_row_slider").slider("value", value);
            $("#min_row_slider").find('.slider-value').text(value);
            if ($("#form-container").valid()) {
                generateTable();
            }
        });

        $("#max_row_value").on("input", function () {
            const value = parseInt($(this).val()) || 0;
            $("#max_row_slider").slider("value", value);
            $("#max_row_slider").find('.slider-value').text(value);
            if ($("#form-container").valid()) {
                generateTable();
            }
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
            console.log("Error message generated for:", element.attr("id"));
            error.addClass("error-message"); // Apply custom styling class
            error.insertAfter(element.parent());
        },
        submitHandler: function () {
            console.log("Submit Handler Triggered - Validation Passed");
            createTab();
        }
    });

    // Custom validator for ensuring max values are greater than or equal to min values
    $.validator.addMethod("greaterThanOrEqual", function (value, element, param) {
        return parseFloat(value) >= parseFloat($(param).val());
    }, "Value must be greater than or equal to {0}");

    // Function to generate the multiplication table
    function generateTable() {
        const minCol = parseInt($("#min_col_value").val());
        const maxCol = parseInt($("#max_col_value").val());
        const minRow = parseInt($("#min_row_value").val());
        const maxRow = parseInt($("#max_row_value").val());

        console.log("Inputs:", { minCol, maxCol, minRow, maxRow });

        const table = $("<table>").attr("id", "multiplication-table");
        const headerRow = $("<tr>");
        headerRow.append($("<th>")); // Top-left empty cell
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

        // Update the table in the input form tab
        $("#table-container").remove();
        const tableContainer = $("<div>").attr("id", "table-container").addClass("table-container");
        tableContainer.append(table);
        $("#tabs-1").append(tableContainer);
    }

    // Function to create a new tab with the generated table
    function createTab() {
        const minCol = parseInt($("#min_col_value").val());
        const maxCol = parseInt($("#max_col_value").val());
        const minRow = parseInt($("#min_row_value").val());
        const maxRow = parseInt($("#max_row_value").val());

        // Generate a unique tab ID
        const tabId = `tab-${Date.now()}`;
        const tabIndex = $("#tabs ul li").length;

        // Create the tab label
        const tabLabel = `[${minCol}, ${maxCol}] x [${minRow}, ${maxRow}]`;

        // Add the new tab with close icon
        $("#tabs ul").append(
            `<li>
                <a href="#${tabId}">${tabLabel}</a>
                <span class="ui-icon ui-icon-close" role="presentation">Remove Tab</span>
            </li>`
        );
        $("#tabs").append(`<div id="${tabId}"></div>`);

        // Generate the table and append it to the new tab
        const table = generateTableForTab(minCol, maxCol, minRow, maxRow);
        $(`#${tabId}`).append(table);

        // Add a checkbox for deletion
        $(`#${tabId}`).prepend(
            `<label>
                <input type="checkbox" class="delete-tab-checkbox" data-tab-id="#${tabId}"> Select for Deletion
            </label>`
        );

        // Refresh the tabs widget
        $("#tabs").tabs("refresh");
        $("#tabs").tabs("option", "active", tabIndex);
    }


    // Function to generate table for the new tab
    function generateTableForTab(minCol, maxCol, minRow, maxRow) {
        const table = $("<table>").attr("id", "multiplication-table");
        const headerRow = $("<tr>");
        headerRow.append($("<th>")); // Top-left empty cell
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

        // Wrap table in a container for consistent styling
        const tableContainer = $("<div>").addClass("table-container");
        tableContainer.append(table);

        return tableContainer;
    }

    // Event delegation for closing individual tabs via close icon
    $("#tabs").on("click", "span.ui-icon-close", function () {
        const panelId = $(this).closest("li").remove().attr("aria-controls");
        $("#" + panelId).remove();
        $("#tabs").tabs("refresh");
    });

    // Function to delete selected tabs
    function deleteSelectedTabs() {
        $(".delete-tab-checkbox:checked").each(function () {
            const tabId = $(this).attr("data-tab-id");
            const tabAnchor = $(`#tabs a[href='${tabId}']`);
            const panelId = tabAnchor.attr("href");
            tabAnchor.closest("li").remove(); // Remove tab
            $(panelId).remove(); // Remove tab content
        });
        $("#tabs").tabs("refresh");
    }

    // Add Delete Tabs Button click event
    $("#delete-tabs-button").click(deleteSelectedTabs);

    // Initialize sliders after document is ready
    initializeSliders();

    // Generate table on initial load if inputs are valid
    if ($("#form-container").valid()) {
        generateTable();
    }
});
