// Dimensions and margins
const margin = { top: 20, right: 50, bottom: 50, left: 70 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Select the chart container
const chartContainer = d3.select("#chart");

// Tooltip div
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip");

  function drawWaterUseChart() {
    chartContainer.html(""); // Clear the existing chart
  
    // Create SVG canvas
    const svg = chartContainer
      .append("svg")
      .attr("width", width + margin.left + margin.right + 50) // Extra space for the right Y-axis
      .attr("height", height + margin.top + margin.bottom + 50) // Extra space for captions and legend
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // Tooltip for interactivity
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("padding", "8px")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "white")
      .style("border-radius", "5px")
      .style("visibility", "hidden")
      .style("font-size", "12px");
  
    // Load Water Use Data
    d3.csv("dataset/Distributed_water_use.csv").then(data => {
      const processedData = data.map(d => ({
        year: d["Year"].trim(),
        waterUse: +d["Households distributed water use (GL)"].replace(",", ""),
        households: +d["Number of households (millions)"],
      }));
  
      // X-axis for Years
      const x = d3.scalePoint()
        .domain(processedData.map(d => d.year))
        .range([0, width]);
  
      // Y-axis for Water Use
      const yLeft = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => d.waterUse) * 1.2])
        .range([height, 0]);
  
      // Y-axis for Households (2 to 12 scale)
      const yRight = d3.scaleLinear()
        .domain([2, 12])
        .range([height, 0]);
  
      // Add Left Y-axis (Water Use)
      svg.append("g").call(d3.axisLeft(yLeft));
  
      // Add Right Y-axis (Households)
      svg.append("g")
        .attr("transform", `translate(${width},0)`)
        .call(d3.axisRight(yRight));
  
      // Add X-axis (Years)
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
  
      // Line for Water Use
      const lineWaterUse = d3.line()
        .x(d => x(d.year))
        .y(d => yLeft(d.waterUse));
  
      const waterUseLine = svg.append("path")
        .datum(processedData)
        .attr("fill", "none")
        .attr("stroke", "#4a90e2")
        .attr("stroke-width", 2)
        .attr("d", lineWaterUse)
        .attr("class", "line-water-use");
  
      // Line for Households
      const lineHouseholds = d3.line()
        .x(d => x(d.year))
        .y(d => yRight(d.households));
  
      const householdsLine = svg.append("path")
        .datum(processedData)
        .attr("fill", "none")
        .attr("stroke", "#e94e77")
        .attr("stroke-width", 2)
        .attr("d", lineHouseholds)
        .attr("class", "line-households");
  
      // Add dots for Water Use
      svg.selectAll(".dot-water-use")
        .data(processedData)
        .enter()
        .append("circle")
        .attr("class", "dot-water-use")
        .attr("cx", d => x(d.year))
        .attr("cy", d => yLeft(d.waterUse))
        .attr("r", 4)
        .attr("fill", "#4a90e2")
        .on("mouseover", (event, d) => {
          tooltip.style("visibility", "visible")
            .text(`Year: ${d.year}, Water Use: ${d.waterUse} GL`);
          d3.select(event.target)
            .transition()
            .duration(200)
            .attr("r", 8)
            .attr("fill", "orange");
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
            .attr("r", 4)
            .attr("fill", "#4a90e2");
        });
  
      // Add dots for Households
      svg.selectAll(".dot-households")
        .data(processedData)
        .enter()
        .append("circle")
        .attr("class", "dot-households")
        .attr("cx", d => x(d.year))
        .attr("cy", d => yRight(d.households))
        .attr("r", 4)
        .attr("fill", "#e94e77")
        .on("mouseover", (event, d) => {
          tooltip.style("visibility", "visible")
            .text(`Year: ${d.year}, Households: ${d.households} million`);
          d3.select(event.target)
            .transition()
            .duration(200)
            .attr("r", 8)
            .attr("fill", "orange");
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
            .attr("r", 4)
            .attr("fill", "#e94e77");
        });
  
      // Add X-axis Caption
      svg.append("text")
        .attr("class", "x-axis-caption")
        .attr("x", width / 2)
        .attr("y", height + 40) // Position below the X-axis
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Year");
  
      // Add Left Y-axis Caption (Water Use)
      svg.append("text")
        .attr("class", "y-axis-caption")
        .attr("x", -height / 2)
        .attr("y", -50) // Position to the left of the Y-axis
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .style("font-size", "14px")
        .text("Water Use (GL)");
  
      // Add Right Y-axis Caption (Households)
      svg.append("text")
        .attr("class", "right-axis-caption")
        .attr("x", width + 40) // Position to the right of the Y-axis
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(90, " + (width + 40) + "," + height / 2 + ")") // Rotate to vertical
        .style("font-size", "14px")
        .text("Number of Households (millions)");
    });
  }
  
  
  // Set chart dimensions
var chartWidth = 400;
var chartHeight = 400;
var radiusOuter = chartWidth / 2;
var radiusInner = 0; // Inner radius is 0 for a full pie chart

// Define color scheme for slices
var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Hardcoded data for two pie charts
var dataGL = [
    { category: "Industries", value: 10.2 },
    { category: "Households", value: 1.8 }
];

var dataBillions = [
    { category: "Industries", value: 3.16 },
    { category: "Households", value: 6.09 }
];

// Initialize the chart
function initializeChart() {
    // Create the SVG container for the pie/donut chart
    var svgContainer = d3.select("#pieChart")
        .append("svg")
        .attr("width", chartWidth)
        .attr("height", chartHeight);

    // Attach events to toggle buttons for pie chart display
    document.getElementById("pieGLButton").onclick = function () {
        renderPie(svgContainer, dataGL);
    };
    document.getElementById("pieBillionsButton").onclick = function () {
        renderPie(svgContainer, dataBillions);
    };

    // Render the first pie chart by default
    renderPie(svgContainer, dataGL);
}

function renderPie(svgContainer, dataset) {
    // Clear previous chart elements
    svgContainer.selectAll("*").remove();

    // Define arc generator for pie chart
    var arcGenerator = d3.arc()
        .outerRadius(radiusOuter)
        .innerRadius(radiusInner); // Full pie with 0 inner radius

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
        .attr("fill", function (d, i) { return colorScale(i); })
        .attr("d", arcGenerator);

    // Add text labels to each slice displaying category and values
    pieSlices.append("text")
        .text(function (d) { return `${d.data.category}: ${d.data.value}`; })
        .attr("transform", function (d) {
            var [x, y] = arcGenerator.centroid(d); // Center text within slice
            var textOffset = 1.5;
            return "translate(" + (x * textOffset) + "," + (y * textOffset) + ")";
        })
        .attr("text-anchor", "middle")
        .attr("font-size", "12px");
}

// Load the chart on page load
window.onload = initializeChart;

// Event Listeners
document.getElementById("water-use-btn")


// Default chart
drawWaterUseChart();


  
  
  
