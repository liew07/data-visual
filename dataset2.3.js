function navigateTo(url) {
    // Navigate to the specified URL
    window.location.href = url;
}


// Data for Chart 1 (split years into individual entries)
const data1 = [ 
    { year: "2014", industry: 0.22, household: 3.49 },
    { year: "2015", industry: 0.29, household: 3.46 },
    { year: "2016", industry: 0.26, household: 3.40 },
    { year: "2017", industry: 0.27, household: 3.38 },
    { year: "2018", industry: 0.37, household: 3.44 },
    { year: "2019", industry: 0.41, household: 3.52 },
    { year: "2020", industry: 0.31, household: 3.41 },
    { year: "2021", industry: 0.31, household: 3.43 }
];

// Chart 1 Setup
const margin1 = { top: 20, right: 30, bottom: 50, left: 70 },
      width1 = 800 - margin1.left - margin1.right,
      height1 = 500 - margin1.top - margin1.bottom;

const svg1 = d3.select("#chart1")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom);

const chartGroup = svg1.append("g")
    .attr("transform", `translate(${margin1.left},${margin1.top})`);

// Scales
const x = d3.scaleBand()
    .domain(data1.map(d => d.year))
    .range([0, width1])
    .padding(0.2);

const y = d3.scaleLinear()
    .domain([0, d3.max(data1, d => d.industry + d.household)]) // Stacked height
    .nice()
    .range([height1, 0]);

const color = d3.scaleOrdinal()
    .domain(["industry", "household"])
    .range(["#1f77b4", "#ff7f0e"]);

// Tooltip
const tooltip1 = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background", "#f9f9f9")
    .style("padding", "8px")
    .style("border", "1px solid #ddd")
    .style("border-radius", "4px");

// Grouped data for stack
const stack = d3.stack()
    .keys(["industry", "household"])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

const series = stack(data1);
// Draw bars
chartGroup.append("g")
    .selectAll("g")
    .data(series)
    .join("g")
    .attr("fill", d => color(d.key))
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", d => x(d.data.year))
    .attr("y", d => y(d[1]))
    .attr("height", d => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth())
    .on("mouseover", function(event, d) {
        tooltip1.style("opacity", 1);
        tooltip1.html(`Value: ${(d[1] - d[0]).toFixed(2)} $/kL`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY}px`);
    })
    .on("mouseout", () => {
        tooltip1.style("opacity", 0);
    });

// Add text labels inside the bars
chartGroup.append("g")
    .selectAll("g")
    .data(series)
    .join("g")
    .attr("fill", d => color(d.key))
    .selectAll("text")
    .data(d => d)
    .join("text")
    .attr("x", d => x(d.data.year) + x.bandwidth() / 2) // Center horizontally
    .attr("y", d => y((d[0] + d[1]) / 2)) // Center vertically in the stack
    .text(d => (d[1] - d[0]).toFixed(2)) // Display the value
    .attr("fill", "white") // Use white text for better visibility
    .attr("text-anchor", "middle") // Center the text horizontally
    .attr("alignment-baseline", "middle"); // Center the text vertically



// Axes
chartGroup.append("g")
    .call(d3.axisLeft(y));

chartGroup.append("g")
    .attr("transform", `translate(0,${height1})`)
    .call(d3.axisBottom(x));

// Add y-axis label
chartGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `rotate(-90) translate(${-height1 / 2},${-margin1.left + 20})`)
    .text("$/kL");

// Add legend
const legend = svg1.append("g")
    .attr("transform", `translate(${margin1.left},${height1 + margin1.top + 30})`);

const legendItems = ["industry", "household"];
legend.selectAll("g")
    .data(legendItems)
    .join("g")
    .attr("transform", (d, i) => `translate(${i * 150}, 0)`)
    .call(g => {
        g.append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", d => color(d));
        g.append("text")
            .attr("x", 30)
            .attr("y", 15)
            .text(d => d)
            .style("font-size", "12px");
    });



document.addEventListener("DOMContentLoaded", () => {
    const barChartContainer = d3.select("#barchart");
    const margin = { top: 30, right: 30, bottom: 100, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = barChartContainer
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const color = d3.scaleOrdinal(d3.schemeSet3); // Soft color palette

    // Scales
    const x0Scale = d3.scaleBand().range([0, width]).padding(0.2); // Scale for years
    const x1Scale = d3.scaleBand().padding(0.1); // Scale for measures within each year
    const yScale = d3.scaleLinear().range([height, 0]); // Scale for values

    // Load data from CSV
    d3.csv("dataset/OECD_Australia_Water_Use2015-2022.csv").then(csvData => {
        // Prepare the data
        const rawData = csvData.map(d => ({
            year: d.year.trim(),
            Measure: d.Measure.trim(),
            value: +d.OBS_VALUE,
        }));

        // Group data by year
        const years = Array.from(new Set(rawData.map(d => d.year)));
        const measures = Array.from(new Set(rawData.map(d => d.Measure)));
        const groupedData = years.map(year => {
            return {
                year,
                measures: measures.map(measure => {
                    const entry = rawData.find(d => d.year === year && d.Measure === measure);
                    return { measure, value: entry ? entry.value : 0 };
                }),
            };
        });

        // Set domains for scales
        x0Scale.domain(years);
        x1Scale.domain(measures).range([0, x0Scale.bandwidth()]);
        yScale.domain([0, d3.max(rawData, d => d.value)]);

        // Add X-Axis
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x0Scale))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-0.8em")
            .attr("dy", "0.15em")
            .attr("transform", "rotate(-45)");

        // Add Y-Axis
        svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

        // Add grouped bars
        const yearGroups = svg
            .selectAll(".year-group")
            .data(groupedData)
            .enter()
            .append("g")
            .attr("class", "year-group")
            .attr("transform", d => `translate(${x0Scale(d.year)}, 0)`);

        yearGroups
            .selectAll("rect")
            .data(d => d.measures)
            .enter()
            .append("rect")
            .attr("x", d => x1Scale(d.measure))
            .attr("y", d => yScale(d.value))
            .attr("width", x1Scale.bandwidth())
            .attr("height", d => height - yScale(d.value))
            .attr("fill", d => color(d.measure))
            .on("mouseover", (event, d) => {
                d3.select(event.target).attr("opacity", 0.7);
                tooltip
                    .style("visibility", "visible")
                    .html(
                        `<strong>Measure:</strong> ${d.measure}<br>
                         <strong>Value:</strong> ${d.value.toLocaleString()} ML`
                    );
            })
            .on("mousemove", (event) => {
                tooltip
                    .style("top", `${event.pageY - 30}px`)
                    .style("left", `${event.pageX + 10}px`);
            })
            .on("mouseout", (event, d) => {
                d3.select(event.target).attr("opacity", 1);
                tooltip.style("visibility", "hidden");
            });

        // Tooltip for bar details
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "rgba(0, 0, 0, 0.8)")
            .style("color", "#fff")
            .style("padding", "8px")
            .style("border-radius", "5px")
            .style("visibility", "hidden")
            .style("font-size", "12px");

        });
    });

document.addEventListener("DOMContentLoaded", () => {
    const width = 1000;
    const height = 800;

    // Select the SVG element
    const svg = d3.select("#map");

    // Tooltip for hover details
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("color", "#fff")
        .style("padding", "8px")
        .style("border-radius", "5px")
        .style("visibility", "hidden")
        .style("font-size", "12px");

    // Map projection
    const projection = d3
        .geoMercator()
        .center([133, -28]) // Center the map on Australia
        .scale(800)
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const color = d3.scaleOrdinal(d3.schemeSet3); // Color palette for measures
    const pieRadius = 50; // Pie chart radius

    const yearSelector = d3.select("#year-selector");

    Promise.all([
        d3.json("dataset/australian-states.json"), // Load GeoJSON
        d3.csv("dataset/dataset1.csv"), // Load water consumption dataset
    ]).then(([geoData, csvData]) => {
        // Group the data by year and state
        const waterData = d3.group(
            csvData,
            d => d.Year.trim(), // Group by year
            d => d.State.trim() // Group by state within each year
        );

        // Populate the year selector dropdown
        const years = Array.from(new Set(csvData.map(d => d.Year.trim())));
        yearSelector
            .selectAll("option")
            .data(years)
            .enter()
            .append("option")
            .attr("value", d => d)
            .text(d => d);

        // Draw the map
        svg.selectAll("path")
            .data(geoData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "#cccccc")
            .attr("stroke", "#666666");

        // Function to update pie charts for the selected year
        function updatePieCharts(selectedYear) {
            svg.selectAll(".pie-group").remove(); // Clear existing pie charts

            geoData.features.forEach(state => {
                const stateName = state.properties.STATE_NAME;
                const centroid = path.centroid(state);

                const stateData = waterData.get(selectedYear)?.get(stateName) || [];
                const pieData = stateData.map(d => ({
                    category: d.Measure,
                    value: +d.WaterUseInMegaliters,
                    state: d.State
                }));

                const pie = d3.pie().value(d => d.value)(pieData);

                const arc = d3.arc().innerRadius(0).outerRadius(pieRadius);

                const pieGroup = svg
                    .append("g")
                    .attr("class", "pie-group")
                    .attr(
                        "transform",
                        `translate(${centroid[0]}, ${centroid[1]})`
                    );

                pieGroup
                    .selectAll("path")
                    .data(pie)
                    .enter()
                    .append("path")
                    .attr("d", arc)
                    .attr("fill", d => color(d.data.category))
                    .on("mouseover", (event, d) => {
                        tooltip
                            .style("visibility", "visible")
                            .html(
                                `<strong>State:</strong> ${d.data.state}<br>
                                 <strong>Measure:</strong> ${d.data.category}<br>
                                 <strong>Value:</strong> ${d.data.value.toLocaleString()} ML`
                            );
                        d3.select(event.target)
                            .style("opacity", 0.8);
                    })
                    .on("mousemove", event => {
                        tooltip
                            .style("top", `${event.pageY - 30}px`)
                            .style("left", `${event.pageX + 10}px`);
                    })
                    .on("mouseout", event => {
                        tooltip.style("visibility", "hidden");
                        d3.select(event.target)
                            .style("opacity", 1);
                    });

                // Add labels for total water usage
                const totalWaterUse = d3.sum(pieData, d => d.value);
                pieGroup
                    .append("text")
                    .attr("text-anchor", "middle")
                    .attr("dy", "1.5em")
                    .style("font-size", "12px")
                    .text(`${totalWaterUse.toFixed(1)} ML`);
            });
        }

        // Update the chart when the year changes
        yearSelector.on("change", function () {
            const selectedYear = d3.select(this).property("value");
            updatePieCharts(selectedYear);
        });

        // Initial render for the first year
        updatePieCharts(years[0]);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const width = 1000;
    const height = 800;

    // Select the SVG element for Map 2
    const svg2 = d3.select("#map2");

    // Tooltip for hover details
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("color", "#fff")
        .style("padding", "8px")
        .style("border-radius", "5px")
        .style("visibility", "hidden")
        .style("font-size", "12px");

    // Display selected measure dynamically
    const measureDisplay = d3.select("#selected-measure");

    // Map projection
    const projection = d3
        .geoMercator()
        .center([133, -28]) // Center on Australia
        .scale(800)
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    Promise.all([
        d3.json("dataset/australian-states.json"), // Load GeoJSON
        d3.csv("dataset/dataset1.csv"), // Load water consumption dataset
    ]).then(([geoData, csvData]) => {
        // Group the data by measure and state
        const waterDataByMeasure = d3.group(
            csvData,
            d => d.Measure.trim(), // Group by measure
            d => d.State.trim() // Group by state within each measure
        );

        // Populate the measure selector dropdown
        const measureSelector = d3.select("#measure-selector");
        const measures = Array.from(new Set(csvData.map(d => d.Measure.trim())));
        measureSelector
            .selectAll("option")
            .data(measures)
            .enter()
            .append("option")
            .attr("value", d => d)
            .text(d => d);

        // Draw Map 2
        svg2.selectAll("path")
            .data(geoData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "#cccccc")
            .attr("stroke", "#666666");

        // Function to update bubbles and measure name
        function updateBubbleMap(selectedMeasure) {
            // Update the displayed measure
            measureDisplay.text(`Current Measure: ${selectedMeasure}`);

            const bubbles = svg2.selectAll(".bubble").data(
                geoData.features.map(state => {
                    const stateName = state.properties.STATE_NAME;
                    const centroid = path.centroid(state);
                    const stateData = waterDataByMeasure.get(selectedMeasure)?.get(stateName) || [];
                    const totalValue = d3.sum(stateData, d => +d.WaterUseInMegaliters);
                    return { stateName, centroid, totalValue };
                }),
                d => d.stateName
            );

            // Enter new bubbles
            bubbles
                .enter()
                .append("circle")
                .attr("class", "bubble")
                .attr("cx", d => d.centroid[0])
                .attr("cy", d => d.centroid[1])
                .attr("r", 0) // Start with radius 0 for animation
                .attr("fill", "rgba(30, 144, 255, 0.7)")
                .attr("stroke", "#1E90FF")
                .attr("stroke-width", 1)
                .on("mouseover", (event, d) => {
                    tooltip
                        .style("visibility", "visible")
                        .html(
                            `<strong>State:</strong> ${d.stateName}<br>
                             <strong>Total Usage:</strong> ${d.totalValue.toLocaleString()} ML`
                        );
                    d3.select(event.target).style("opacity", 0.8);
                })
                .on("mousemove", (event) => {
                    tooltip
                        .style("top", `${event.pageY - 30}px`)
                        .style("left", `${event.pageX + 10}px`);
                })
                .on("mouseout", (event) => {
                    tooltip.style("visibility", "hidden");
                    d3.select(event.target).style("opacity", 1);
                })
                .transition()
                .duration(1000) // Animation duration
                .attr("r", d => Math.sqrt(d.totalValue) / 100); // Final radius

            // Update existing bubbles
            bubbles
                .transition()
                .duration(1000) // Animation duration
                .attr("cx", d => d.centroid[0])
                .attr("cy", d => d.centroid[1])
                .attr("r", d => Math.sqrt(d.totalValue) / 100); // Adjust radius dynamically

            // Remove bubbles that are no longer needed
            bubbles
                .exit()
                .transition()
                .duration(500) // Animation for removal
                .attr("r", 0) // Shrink radius to 0
                .remove();
        }

        // Update Map 2 when the measure changes
        measureSelector.on("change", function () {
            const selectedMeasure = d3.select(this).property("value");
            updateBubbleMap(selectedMeasure);
        });

        // Initial render for the first measure
        updateBubbleMap(measures[0]);
    });
});
