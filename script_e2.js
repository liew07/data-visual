// Set chart dimensions
var chartWidth = 400;
var chartHeight = 400;
var radiusOuter = chartWidth / 2;
var radiusInner = radiusOuter / 2; // Inner radius for donut chart

// Define color scheme for slices
var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Hardcoded data for pie and donut charts
var dataGL = [
    { category: "Industries", value: 10.2 },
    { category: "Households", value: 1.8 }
];

var dataBillions = [
    { category: "Industries", value: 3.16 },
    { category: "Households", value: 6.09 }
];

// Initialize the charts
function initializeChart() {
    // Create the SVG container for the pie/donut chart
    var svgContainerGL = d3.select("#pieChartGL")
        .append("svg")
        .attr("width", chartWidth)
        .attr("height", chartHeight);

    var svgContainerBillions = d3.select("#donutChartBillions")
        .append("svg")
        .attr("width", chartWidth)
        .attr("height", chartHeight);

    // Render the charts
    renderInteractivePie(svgContainerGL, dataGL);
    renderInteractiveDonut(svgContainerBillions, dataBillions);
}

// Render Interactive Pie Chart
function renderInteractivePie(svgContainer, dataset) {
    // Clear previous chart elements
    svgContainer.selectAll("*").remove();

    // Tooltip for interactivity
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("padding", "8px")
        .style("background", "rgba(0, 0, 0, 0.7)")
        .style("color", "white")
        .style("border-radius", "8px")
        .style("visibility", "hidden")
        .style("font-size", "12px");

    // Define arc generator for pie chart
    var arcGenerator = d3.arc()
        .outerRadius(radiusOuter)
        .innerRadius(0); // Full pie with 0 inner radius

    // Generate pie layout
    var pieLayout = d3.pie().value(d => d.value);

    // Create group elements for each slice of the pie chart
    var pieSlices = svgContainer.selectAll("g.slice")
        .data(pieLayout(dataset))
        .enter()
        .append("g")
        .attr("class", "slice")
        .attr("transform", "translate(" + radiusOuter + "," + radiusOuter + ")"); // Center chart

    // Draw slice paths with colors
    pieSlices.append("path")
        .attr("fill", (d, i) => colorScale(i))
        .attr("d", arcGenerator)
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible")
                .text(`${d.data.category}: ${d.data.value}`);
            d3.select(event.target)
                .transition()
                .duration(200)
                .attr("opacity", 0.7); // Highlight effect
        })
        .on("mousemove", event => {
            tooltip.style("top", `${event.pageY - 30}px`)
                .style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", event => {
            tooltip.style("visibility", "hidden");
            d3.select(event.target)
                .transition()
                .duration(200)
                .attr("opacity", 1); // Restore original opacity
        });

    // Add text labels to each slice displaying category and values
    pieSlices.append("text")
        .text(d => `${d.data.category}`)
        .attr("transform", d => {
            var [x, y] = arcGenerator.centroid(d);
            return `translate(${x * 1.5}, ${y * 1.5})`;
        })
        .attr("text-anchor", "middle")
        .attr("font-size", "12px");
}

// Render Interactive Donut Chart
function renderInteractiveDonut(svgContainer, dataset) {
    // Clear previous chart elements
    svgContainer.selectAll("*").remove();

    // Tooltip for interactivity
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("padding", "8px")
        .style("background", "rgba(0, 0, 0, 0.7)")
        .style("color", "white")
        .style("border-radius", "5px")
        .style("visibility", "hidden")
        .style("font-size", "12px");

    // Define arc generator for donut chart
    var arcGenerator = d3.arc()
        .outerRadius(radiusOuter)
        .innerRadius(radiusInner); // Donut shape with inner radius

    // Generate pie layout
    var pieLayout = d3.pie().value(d => d.value);

    // Create group elements for each slice of the donut chart
    var donutSlices = svgContainer.selectAll("g.slice")
        .data(pieLayout(dataset))
        .enter()
        .append("g")
        .attr("class", "slice")
        .attr("transform", "translate(" + radiusOuter + "," + radiusOuter + ")"); // Center chart

    // Draw slice paths with fill colors
    donutSlices.append("path")
        .attr("fill", (d, i) => colorScale(i))
        .attr("d", arcGenerator)
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible")
                .text(`${d.data.category}: ${d.data.value}`);
            d3.select(event.target)
                .transition()
                .duration(200)
                .attr("opacity", 0.7); // Highlight effect
        })
        .on("mousemove", event => {
            tooltip.style("top", `${event.pageY - 30}px`)
                .style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", event => {
            tooltip.style("visibility", "hidden");
            d3.select(event.target)
                .transition()
                .duration(200)
                .attr("opacity", 1); // Restore original opacity
        });

    // Add text labels to each slice displaying category and values
    donutSlices.append("text")
        .text(d => `${d.data.category}`)
        .attr("transform", d => {
            var [x, y] = arcGenerator.centroid(d);
            return `translate(${x * 1.2}, ${y * 1.2})`;
        })
        .attr("text-anchor", "middle")
        .attr("font-size", "12px");
}

// Show GL Chart
function showGLChart() {
    document.getElementById("pieChartGL").style.display = "block";
    document.getElementById("donutChartBillions").style.display = "none";
}

// Show Expenditure Chart
function showBillionsChart() {
    document.getElementById("pieChartGL").style.display = "none";
    document.getElementById("donutChartBillions").style.display = "block";
}

// Set up event listeners for buttons
document.getElementById("showGLBtn").addEventListener("click", showGLChart);
document.getElementById("showBillionsBtn").addEventListener("click", showBillionsChart);

// Load the charts on page load
window.onload = initializeChart;
