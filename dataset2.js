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


const width = 1000, height = 550;



// Append the SVG container
const svg = d3.select("#map")
    .attr("width", width)
    .attr("height", height);

const g = svg.append("g"); // Group for all map features

const projection = d3.geoMercator()
    .center([109, 3.5]) // Center coordinates for Malaysia
    .scale(3000)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

const zoom = d3.zoom()
    .scaleExtent([1, 8]) // Limit zoom scale (min: 1x, max: 8x)
    .on("zoom", (event) => {
        g.attr("transform", event.transform); // Apply zoom transformation
    });

svg.call(zoom); // Enable zoom on the SVG container

Promise.all([
    d3.json("dataset/states.geojson"), // GeoJSON file for map
    d3.csv("dataset/Filtered_GDP_State_Data_with_Yeary.csv") // GDP dataset
]).then(([geoData, gdpData]) => {
    // Create a lookup table for GDP values by state and year
    const gdpLookup = {};
    gdpData.forEach(d => {
        const stateName = d.state.trim();
        const year = d.Year.trim();
        const value = +d.value_of_GDP_in_RM_millions;

        if (!gdpLookup[stateName]) gdpLookup[stateName] = {};
        gdpLookup[stateName][year] = value;
    });

    // Initial settings
    let selectedYear = "2023"; // Default year

    // Function to update the map
    function updateMap(year) {
        geoData.features.forEach(feature => {
            const stateName = feature.properties.Name.trim();
            feature.properties.gdpValue = gdpLookup[stateName]?.[year] || 0; // Assign GDP value for the year
        });

        // Update the map visualization
        g.selectAll("path")
            .data(geoData.features)
            .join("path")
            .attr("d", path)
            .attr("fill", "#ddd") // Static color for simplicity
            .attr("stroke", "#333")
            .attr("stroke-width", 0.5)
            .on("mouseover", function (event, d) {
                d3.select(this).attr("stroke", "black").attr("stroke-width", 1.5);
                tooltip
                    .classed("hidden", false)
                    .html(`
                        <strong>${d.properties.Name}</strong><br>
                        GDP (${year}): RM ${d.properties.gdpValue.toLocaleString()} million
                    `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 20) + "px");
            })
            .on("mousemove", function (event) {
                tooltip
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 20) + "px");
            })
            .on("mouseout", function () {
                d3.select(this).attr("stroke", "#333").attr("stroke-width", 0.5);
                tooltip.classed("hidden", true);
            });
    }

    // Tooltip setup
    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .attr("class", "hidden")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("padding", "5px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "5px")
        .style("pointer-events", "none");

    // Initial rendering
    updateMap(selectedYear);

    // Event listener for year slider
    d3.select("#yearRange").on("input", function () {
        selectedYear = this.value;
        d3.select("#yearLabel").text(selectedYear);
        updateMap(selectedYear);
    });
}).catch(error => {
    console.error("Error loading data:", error);
});




// Zoom buttons
d3.select("#zoom-in").on("click", () => {
    svg.transition().call(zoom.scaleBy, 1.2); // Zoom in by 1.2x
});

d3.select("#zoom-out").on("click", () => {
    svg.transition().call(zoom.scaleBy, 0.8); // Zoom out by 0.8x
});

// Add bounding boxes for East and West Malaysia
const eastMalaysiaBounds = [[109, 0.8], [120, 7]]; // Approximate bounding box for East Malaysia
const westMalaysiaBounds = [[99.5, 1], [105, 6.7]]; // Approximate bounding box for West Malaysia

// Function to zoom to a bounding box
function zoomToRegion(bounds) {
    const [[x0, y0], [x1, y1]] = bounds;
    const [[x0p, y0p], [x1p, y1p]] = [
        projection([x0, y0]),
        projection([x1, y1])
    ];

    const widthScale = width / Math.abs(x1p - x0p);
    const heightScale = height / Math.abs(y1p - y0p);
    const scale = Math.min(widthScale, heightScale);

    const translate = [
        (width - (x1p + x0p) * scale) / 2,
        (height - (y1p + y0p) * scale) / 2
    ];

    svg.transition()
        .duration(1000)
        .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
}

// Add event listeners to buttons
d3.select("#east-malaysia").on("click", () => zoomToRegion(eastMalaysiaBounds));
d3.select("#west-malaysia").on("click", () => zoomToRegion(westMalaysiaBounds));

// Select the slider and label elements
const yearRange = document.getElementById("yearRange");
const yearLabel = document.getElementById("yearLabel");

// Update the label when the slider value changes
yearRange.addEventListener("input", (event) => {
    const selectedYear = event.target.value;
    yearLabel.textContent = selectedYear;

    // You can trigger a function to update the map or data based on the selected year
    updateMapForYear(selectedYear);
});

// Function to update the map or perform any actions based on the selected year
function updateMapForYear(year) {
    console.log(`Update map for year: ${year}`);
    // Add logic here to load new data or update the map visualization
}
