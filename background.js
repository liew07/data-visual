function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.querySelector('.content');

    if (sidebar.classList.contains('hidden')) {
        // Show sidebar
        sidebar.classList.remove('hidden');
        content.style.marginLeft = '250px'; // Adjust content margin for sidebar width
        localStorage.setItem('sidebarVisible', 'true'); // Save state in localStorage
    } else {
        // Hide sidebar
        sidebar.classList.add('hidden');
        content.style.marginLeft = '0'; // Remove content margin
        localStorage.setItem('sidebarVisible', 'false'); // Save state in localStorage
    }
}

// Ensure the sidebar's state is applied on page load
window.onload = function () {
    const sidebar = document.getElementById('sidebar');
    const content = document.querySelector('.content');
    const sidebarVisible = localStorage.getItem('sidebarVisible');

    if (sidebarVisible === 'false') {
        // Hide sidebar if previously hidden
        sidebar.classList.add('hidden');
        content.style.marginLeft = '0';
    } else {
        // Show sidebar by default
        sidebar.classList.remove('hidden');
        content.style.marginLeft = '250px';
    }
};




function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdown-menu');
    dropdownMenu.classList.toggle('show'); // Toggles visibility
}

function setActive(itemId) {
    const items = document.querySelectorAll('.sidebar ul li');
    items.forEach(item => item.classList.remove('active')); // Remove active class from all
    document.getElementById(itemId).classList.add('active'); // Add active class to clicked
}


function setActive(sectionId) {
    // Remove 'active' class from all sidebar items
    const sidebarItems = document.querySelectorAll(".sidebar ul li");
    sidebarItems.forEach((item) => item.classList.remove("active"));

    // Add 'active' class to the selected item
    const selectedItem = document.getElementById(sectionId);
    if (selectedItem) {
        selectedItem.classList.add("active");
    }

    // Collapse the dropdown if clicking outside Project Overview
    if (sectionId !== "ict") {
        collapseDropdown("dropdown-menu");
    }
}



function collapseDropdown(dropdownId) {
    const dropdownMenu = document.getElementById(dropdownId);
    dropdownMenu.classList.add("hidden");
    dropdownMenu.classList.remove("show");
}

function navigateTo(url) {
    // Navigate to the specified URL
    window.location.href = url;
}

// Dynamically set width and height based on the container
const svg = d3.select("#map");
const container = document.getElementById("map-container");

// Get dynamic width and height from the container
const width = 1000;
const height = 380; // Set desired height for the map

svg.attr("width", width).attr("height", height);

// Add a <g> element for zoomable content
const g = svg.append("g");

// Define the map projection
const projection = d3.geoMercator()
    .center([135, -25]) // Center coordinates of Australia (longitude, latitude)
    .scale(680) // Adjust the scale to fit Australia better
    .translate([width / 2, height / 2]); // Dynamically center the map

const path = d3.geoPath().projection(projection);

// Define a color scale for the states
const colorScale = d3.scaleOrdinal(d3.schemeSet3); // Uses a categorical scheme with more distinct colors



// Create a tooltip for hover interaction
const tooltip = d3.select("body").append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "rgba(0, 0, 0, 0.7)")
    .style("color", "#fff")
    .style("padding", "8px")
    .style("border-radius", "5px")
    .style("font-size", "12px")
    .style("box-shadow", "0px 0px 8px rgba(0,0,0,0.3)");

// Load GeoJSON and draw the map
d3.json("dataset/australian-states.json").then(geoData => {
    // Draw state shapes with different colors
    g.selectAll("path")
        .data(geoData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", (d, i) => colorScale(i)) // Assign a different color for each state
        .attr("stroke", "#333")
        .attr("stroke-width", 0.5)
        .on("mouseover", function (event, d) {
            d3.select(this)
                .attr("stroke", "black") // Bold the edge
                .attr("stroke-width", 2); // Increase stroke width for emphasis

            tooltip
                .style("visibility", "visible")
                .html(`<strong>${d.properties.STATE_NAME}</strong>`); // Show state name in tooltip
        })
        .on("mousemove", function (event) {
            tooltip
                .style("top", `${event.pageY - 10}px`)
                .style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", function (event, d) {
            d3.select(this)
                .attr("stroke", "#333") // Reset stroke to original color
                .attr("stroke-width", 0.5); // Reset stroke width

            tooltip.style("visibility", "hidden"); // Hide tooltip
        });

    // Add state labels
    g.selectAll("text")
        .data(geoData.features)
        .enter()
        .append("text")
        .attr("x", d => path.centroid(d)[0]) // X-coordinate for the label
        .attr("y", d => path.centroid(d)[1]) // Y-coordinate for the label
        .attr("text-anchor", "middle") // Center align the text
        .attr("font-size", "12px") // Font size for the labels
        .attr("font-weight", "bold") // Bold font for better visibility
        .attr("fill", "black") // Black text color
        .text(d => d.properties.STATE_NAME) // Replace 'Name' with the actual property key in your GeoJSON
        .attr("pointer-events", "none"); // Prevent interfering with hover events on states
}).catch(error => {
    console.error("Error loading GeoJSON:", error);
});
