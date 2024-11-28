document.addEventListener('DOMContentLoaded', function() {
    // Data for the chart
    const labels = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
    const gdpBarData = [1356.12, 1355.17, 1436.995, 1614.555, 1643.31, 1518.57, 1682.235, 1831.635, 1528.425];

    // Data for five sectors
    const agricultureData = [97539, 105756, 117995, 108757, 109542, 115834, 148152, 160567, 141930];
    const miningData = [103059, 103959, 121326, 134833, 131084, 96172, 124355, 178439, 155983];
    const manufacturingData = [262379, 272396, 299797, 311676, 323862, 315360, 361826, 418538, 419584];
    const constructionData = [55382, 61089, 66552, 70048, 71067, 57657, 55654, 60810, 65949];
    const servicesData = [643883, 689969, 747360, 804993, 860130, 817713, 841692, 956737, 1018972];

    // Set up margins and dimensions for the chart
    const margin = { top: 40, right: 500, bottom: 80, left: 600 };
    const width = 1000;
    const height = 600;

    // Create the SVG container
    const svg = d3.select("#gdpChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Scales
    const xScale = d3.scaleBand()
        .domain(labels)
        .range([0, width])
        .padding(0.1);

    const yScaleGDP = d3.scaleLinear()
        .domain([0, d3.max(gdpBarData) + 200]) // Adjust the max value for some padding
        .nice()
        .range([height, 0]);

    const yScaleSector = d3.scaleLinear()
        .domain([0, d3.max(servicesData)]) // Maximum value from the sector data (services)
        .nice()
        .range([height, 0]);

    // Add X axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).tickSize(0));

    // Add Y axis for GDP
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScaleGDP));

    // Add Y axis for sectors
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + width + ",0)") // Right side axis
   

   
    // Bar chart for GDP
    const bars = svg.selectAll(".bar")
        .data(gdpBarData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => xScale(labels[i]))
        .attr("y", d => yScaleGDP(d))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScaleGDP(d));

    // Line chart function to draw each sector line
    function drawLine(data, color) {
        const line = d3.line()
            .x((d, i) => xScale(labels[i]) + xScale.bandwidth() / 2) // Positioning at the middle of the bar
            .y(d => yScaleSector(d));

        return svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", line)
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("fill", "none");
    }

    // Draw sector lines
    const agricultureLine = drawLine(agricultureData, "rgba(255, 99, 132, 1)");
    const miningLine = drawLine(miningData, "rgba(255, 159, 64, 1)");
    const manufacturingLine = drawLine(manufacturingData, "rgba(54, 162, 235, 1)");
    const constructionLine = drawLine(constructionData, "rgba(153, 102, 255, 1)");
    const servicesLine = drawLine(servicesData, "rgba(201, 203, 207, 1)");


    // Add chart titles and labels
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("class", "chart-title")
        .style("text-anchor", "middle",)
        .text("Malaysia GDP and Sector Data (2015-2023)");

    // Add label for the X axis (Year)
    svg.append("text")
        .attr("x", width / 2)  // Center the label below the axis
        .attr("y", height + 50)  // Position it below the X axis
        .style("text-anchor", "middle")
        .attr("class", "axis-label")
        .text("Year");

    // Add title for the left Y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -40)
        .style("text-anchor", "middle")
        .attr("class", "axis-label")
        .text("Overall GDP (MYR Billion)");

            // Legend data
    const legendData = [
        { name: "Agriculture", color: "rgba(255, 99, 132, 1)" },
        { name: "Mining", color: "rgba(255, 159, 64, 1)" },
        { name: "Manufacturing", color: "rgba(54, 162, 235, 1)" },
        { name: "Construction", color: "rgba(153, 102, 255, 1)" },
        { name: "Services", color: "rgba(201, 203, 207, 1)" }
    ];

    // Add legend container
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(0, ${height + margin.bottom - 30})`); // Adjust position below the chart

    // Add legend items
    const legendItem = legend.selectAll(".legend-item")
        .data(legendData)
        .enter().append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(${i * 150}, 0)`); // Spacing between legend items

    // Add legend rectangles (colored boxes)
    legendItem.append("rect")
        .attr("x", 100)
        .attr("y", -445)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", d => d.color);

    // Add legend text
    legendItem.append("text")
        .attr("x", 130) // Position text next to the rectangle
        .attr("y", -430) // Center text vertically
        .style("font-size", "14px")
        .style("text-anchor", "start")
        .text(d => d.name);

        

    // Create tooltip (hidden by default)
    const tooltip = d3.select("#gdpChart")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("opacity", 0)
        .style("background-color", "rgba(0, 0, 0, 0.75)")
        .style("color", "#fff")
        .style("padding", "10px")
        .style("border-radius", "4px")
        .style("font-size", "14px");

    // Hover effect for GDP bar chart
    bars.on("mouseover", function(event, d) {
        const index = d3.select(this).datum(); // Get the index of the hovered bar
        tooltip.transition()
            .duration(200)
            .style("opacity", 1); // Show tooltip

        tooltip.html(`Year: ${labels[bars.nodes().indexOf(this)]}<br>GDP: ${d3.format(".2f")(d)} Billion MYR`)
            .style("left", (event.pageX + 10) + "px")  // Position tooltip next to the cursor
            .style("top", (event.pageY - 50) + "px");  // Position the tooltip above the cursor
    })
    .on("mouseout", function(event, d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", 0); // Hide tooltip
    });

    // Hover effect for sector line chart
    function addHoverEffectWithDots(line, data, sectorName) {
        // Add circles (dots) to the line chart
        svg.selectAll(`.${sectorName}-dot`)
            .data(data)
            .enter().append("circle")
            .attr("class", `${sectorName}-dot`)
            .attr("cx", (d, i) => xScale(labels[i]) + xScale.bandwidth() / 2)
            .attr("cy", d => yScaleSector(d))
            .attr("r", 4)
            .attr("fill", line.attr("stroke"))
            .on("mouseover", function(event, d) {
                const index = d3.select(this).datum();
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1); // Show tooltip

                tooltip.html(`Year: ${labels[svg.selectAll(`.${sectorName}-dot`).nodes().indexOf(this)]}<br>${sectorName} GDP: ${d3.format(".2f")(d)} MYR`)
                    .style("left", (event.pageX + 10) + "px") // Position tooltip near the cursor
                    .style("top", (event.pageY - 50) + "px");  // Position above the cursor
            })
            .on("mouseout", function(event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0); // Hide tooltip
            });
    }

    // Add hover effects with dots for each sector line
    addHoverEffectWithDots(agricultureLine, agricultureData, "Agriculture");
    addHoverEffectWithDots(miningLine, miningData, "Mining");
    addHoverEffectWithDots(manufacturingLine, manufacturingData, "Manufacturing");
    addHoverEffectWithDots(constructionLine, constructionData, "Construction");
    addHoverEffectWithDots(servicesLine, servicesData, "Services");
});






