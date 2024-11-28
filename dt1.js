// Data for Chart 1
const data1 = [ 
    { year: "2014-15", industry: 0.22, household: 3.49 },
    { year: "2015-16", industry: 0.29, household: 3.46 },
    { year: "2016-17", industry: 0.26, household: 3.40 },
    { year: "2017-18", industry: 0.27, household: 3.38 },
    { year: "2018-19", industry: 0.37, household: 3.44 },
    { year: "2019-20", industry: 0.41, household: 3.52 },
    { year: "2020-21", industry: 0.31, household: 3.41 },
    { year: "2021-22", industry: 0.31, household: 3.43 }
];

// Chart 1 Setup
const margin1 = { top: 20, right: 30, bottom: 40, left: 50 },
      width1 = 800 - margin1.left - margin1.right,
      height1 = 500 - margin1.top - margin1.bottom;

const svg1 = d3.select("#chart1")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom)
    .append("g")
    .attr("transform", `translate(${margin1.left},${margin1.top})`);

const x0 = d3.scaleBand()
    .domain(data1.map(d => d.year))
    .range([0, width1])
    .padding(0.2);

const x1 = d3.scaleBand()
    .domain(["industry", "household"])
    .range([0, x0.bandwidth()])
    .padding(0.1);

const y1 = d3.scaleLinear()
    .domain([0, d3.max(data1, d => Math.max(d.industry, d.household))])
    .nice()
    .range([height1, 0]);

const color1 = d3.scaleOrdinal()
    .domain(["industry", "household"])
    .range(["#1f77b4", "#ff7f0e"]);

// Tooltip for Chart 1
const tooltip1 = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background", "#f9f9f9")
    .style("padding", "8px")
    .style("border", "1px solid #ddd")
    .style("border-radius", "4px");

svg1.append("g")
    .selectAll("g")
    .data(data1)
    .join("g")
    .attr("transform", d => `translate(${x0(d.year)},0)`)
    .selectAll("rect")
    .data(d => ["industry", "household"].map(key => ({ key, value: d[key] })))
    .join("rect")
    .attr("x", d => x1(d.key))
    .attr("y", d => y1(d.value))
    .attr("width", x1.bandwidth())
    .attr("height", d => height1 - y1(d.value))
    .attr("fill", d => color1(d.key))
    .on("mouseover", function(event, d) {
        tooltip1.style("opacity", 1);
        tooltip1.html(`${d.key}: ${d.value}`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY}px`);
    })
    .on("mouseout", () => {
        tooltip1.style("opacity", 0);
    });

svg1.append("g")
    .call(d3.axisLeft(y1));

svg1.append("g")
    .attr("transform", `translate(0,${height1})`)
    .call(d3.axisBottom(x0));

// Data for Chart 2
const data2 = [
    { year: "2014-15", household: 0.1872, industry: 8.53 },
    { year: "2015-16", household: 0.1903, industry: 7.64 },
    { year: "2016-17", household: 0.1837, industry: 7.86 },
    { year: "2017-18", household: 0.1883, industry: 8.22 },
    { year: "2018-19", household: 0.1861, industry: 6.74 },
    { year: "2019-20", household: 0.1829, industry: 5.64 },
    { year: "2020-21", household: 0.1812, industry: 6.90 },
    { year: "2021-22", household: 0.1753, industry: 6.65 }
];

// Chart 2 Setup
const margin2 = { top: 20, right: 30, bottom: 40, left: 50 },
      width2 = 800 - margin2.left - margin2.right,
      height2 = 500 - margin2.top - margin2.bottom;

const svg2 = d3.select("#chart2")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", `translate(${margin2.left},${margin2.top})`);

const y2 = d3.scaleBand()
    .domain(data2.map(d => d.year))
    .range([0, height2])
    .padding(0.2);

const x2 = d3.scaleLinear()
    .domain([0, d3.max(data2, d => d.household + d.industry)])
    .nice()
    .range([0, width2]);

const color2 = d3.scaleOrdinal()
    .domain(["household", "industry"])
    .range(["#1f77b4", "#ff7f0e"]);

// Tooltip for Chart 2
const tooltip2 = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background", "#f9f9f9")
    .style("padding", "8px")
    .style("border", "1px solid #ddd")
    .style("border-radius", "4px");

const stack = d3.stack()
    .keys(["household", "industry"]);

svg2.selectAll(".bar")
    .data(stack(data2))
    .join("g")
    .attr("fill", d => color2(d.key))
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("y", d => y2(d.data.year))
    .attr("x", d => x2(d[0]))
    .attr("width", d => x2(d[1]) - x2(d[0]))
    .attr("height", y2.bandwidth())
    .on("mouseover", function(event, d) {
        tooltip2.style("opacity", 1);
        tooltip2.html(`${d.data.year}<br>${d[1] - d[0]}`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY}px`);
    })
    .on("mouseout", () => {
        tooltip2.style("opacity", 0);
    });

svg2.append("g")
    .call(d3.axisLeft(y2));

svg2.append("g")
    .attr("transform", `translate(0,${height2})`)
    .call(d3.axisBottom(x2));

    const legend1 = svg1.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("text-anchor", "start")
    .selectAll("g")
    .data(["industry", "household"])
    .join("g")
    .attr("transform", (d, i) => `translate(${i * 100}, ${height1 + margin1.bottom - 20})`);

legend1.append("rect")
    .attr("x", 0)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", color1);

legend1.append("text")
    .attr("x", 25)
    .attr("y", 10)
    .attr("dy", "0.35em")
    .text(d => d);


    const legend2 = svg2.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("text-anchor", "start")
    .selectAll("g")
    .data(["household", "industry"])
    .join("g")
    .attr("transform", (d, i) => `translate(${i * 100}, ${height2 + margin2.bottom - 20})`);

legend2.append("rect")
    .attr("x", 0)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", color2);

legend2.append("text")
    .attr("x", 25)
    .attr("y", 10)
    .attr("dy", "0.35em")
    .text(d => d);