const data = [
    { year: "2014-15", household: 0.1872, industry: 8.53 },
    { year: "2015-16", household: 0.1903, industry: 7.64 },
    { year: "2016-17", household: 0.1837, industry: 7.86 },
    { year: "2017-18", household: 0.1883, industry: 8.22 },
    { year: "2018-19", household: 0.1861, industry: 6.74 },
    { year: "2019-20", household: 0.1829, industry: 5.64 },
    { year: "2020-21", household: 0.1812, industry: 6.90 },
    { year: "2021-22", household: 0.1753, industry: 6.65 }
];

const margin = { top: 20, right: 300, bottom: 40, left: 200 },
      width = 800 ,
      height = 500 ;

const svg = d3.select("#chart2")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const y = d3.scaleBand()
    .domain(data.map(d => d.year))
    .range([0, height])
    .padding(0.2);

const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.household + d.industry)])
    .nice()
    .range([0, width]);

const color = d3.scaleOrdinal()
    .domain(["household", "industry"])
    .range(["#1f77b4", "#ff7f0e"]);

const stack = d3.stack()
    .keys(["household", "industry"]);

const tooltip = d3.select("#chart2").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

svg.selectAll(".bar")
    .data(stack(data))
    .join("g")
    .attr("fill", d => color(d.key))
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("y", d => y(d.data.year))
    .attr("x", d => x(d[0]))
    .attr("width", d => x(d[1]) - x(d[0]))
    .attr("height", y.bandwidth())
    .on("mouseover", function(event, d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(`${d.data.year}<br>${d[1] - d[0]}`)
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

svg.append("g")
    .call(d3.axisLeft(y));

svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(null, "s"))
    .append("text")
    .attr("x", width)
    .attr("y", -10)
    .attr("fill", "#000")
    .attr("text-anchor", "end")
    .text("ML");

const legend = svg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(["household", "industry"])
    .join("g")
    .attr("transform", (d, i) => `translate(0,${i * 20})`);

legend.append("rect")
    .attr("x", width - 19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", color);

legend.append("text")
    .attr("x", width +54)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(d => d);