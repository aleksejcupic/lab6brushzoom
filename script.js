d3.csv('unemployment.csv', d3.autoType).then(data => {
    console.log(data);
    dataForAreaChart = data.map((d) => {
		for (const [key, value] of Object.entries(d)) {
			if (key != "date") totalU += value;
		}
		d.total = totalU;
		totalU = 0;
	});

    const areaChart1 = AreaChart(".chart-container1");

    areaChart1.update(dataForAreaChart);  

    const areaChart2 = StackedAreaChart(".chart-container2");

    StackedAreaChart.update(data);
});

// input: selector for a chart container e.g., ".chart>"
function AreaChart(container) {

	// initialization
    var margin = {top: 20, right: 10, bottom: 20, left: 50};

    var width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // create svg with margin convention
    const svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // define scales using scaleTime() and scaleLinear()
    // only specify ranges (domains will be set in update function)
    const xScale = d3.scaleTime()
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .range([0, height]);

    // TODO: create single path for the area and assign a class name to select it in update
    var series = d3.stack()
        .keys(data.columns.slice(1))(data);

    svg.append("path")
        .datum(data)
        .attr("fill", "steelblue")
        .attr("d", area);

    // create axes containers
    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    svg.append('g')
        .attr('class', 'axis y-axis')
        .call(d3.axisLeft(yScale).ticks(5, "s"));

	function update(data) { 
		// update scales, encodings, axes (use the total count)
        // update domains of the scales using data passed to update
        xScale.domain(data.map(d => d.date));
        yScale.domain(data.map(d => d.totalU));

        // create an area generator using d3.area
            // single call to .x(...) which sets x0 to given accessor and x1 to null
        area = d3.area()
            .x(d => x(d.data.date))
            .y0(d => yScale(d[0]))
            .y1(d => yScale(d[1]));

        // select path using its class name
        // set data using datum
        // call the area function using .attr("d", area)
        svg.append("g")
            .selectAll("path")
            .data(series)
            .join("path")
                .attr("fill", ({key}) => color(key))
                .attr("d", area)
            .append("title")
                .text(({key}) => key);

        // update axes using updated scales
        svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

        svg.append('g')
            .attr('class', 'axis y-axis')
            .call(d3.axisLeft(yScale).ticks(5, "s"));
	}

	return {
		update // ES6 shorthand for "update": update
	};
}

// function StackedAreaChart(container) {
//     // initialization
//     var margin = {top: 20, right: 10, bottom: 20, left: 50};

//     var width = 960 - margin.left - margin.right,
//         height = 500 - margin.top - margin.bottom;

//     // input: selector for a chart container e.g., ".chart"
//     // create svg with margin convention
//     const svg = d3.select(".chart").append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//     const xScale = d3.scaleTime()
//         .range([0, width]);

//     const yScale = d3.scaleLinear()
//         .range([0, height]);

//     const categoryScale = d3.scaleOrdinal();

//     // create axes containers
//     svg.append("g")
//         .attr("class", "axis x-axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(xScale));

//     svg.append('g')
//         .attr('class', 'axis y-axis')
//         .call(d3.axisLeft(yScale).ticks(5, "s"));

//     var stack = d3.stack()
//     .keys([
//             "Wholesale and Retail Trade",
//             "Manufacturing", 
//             "Leisure and hospitality", 
//             "Business services",
//             "Construction",
//             "Education and Health",
//             "Government",
//             "Finance",
//             "Self-employed",
//             "Other",
//             "Transportation and Utilities",
//             "Information",
//             "Agriculture",
//             "Mining and Extraction"
//         ])
//     .order(d3.stackOrderNone)
//     .offset(d3.stackOffsetNone);

//     series = stack(data);

//     function update(data) {
//         // extract category names "keys" for stacking
//             // use columsn in data to extract names and use slice(1) to exclude date
//         // compute a stack from the data
//         // update the domains of the scales
//             // use keys for the color scale
//             // for domain of the y scale, find max by d3.max
//         // d3.max(stackedData,
//         //     d => d3.max(...) // using max of nested array using y1 or d[1]
//         // )

//         // create an area generator 
//         // const area = d3.area()
// 	    //     .x(...)
// 	    //     .y0(...)
// 	    //     .y1(...);

//         // create area based on the stack
//         const areas = svg.selectAll(".area")
//             .data(stackedData, d => d.key);
    
//         // areas.enter() // or you could use join()
//         //     .append("path")
//         //     ...
//         //     .merge(areas)
//         //     .attr("d", area)
//         //     ...
    
//         areas.exit().remove();

//         // update axes
//     }

//     return {
//         update
//     }
// }


// function StackedAreaChart(data, {
//     x = ([x]) => x, // given d in data, returns the (ordinal) x-value
//     y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
//     z = () => 1, // given d in data, returns the (categorical) z-value
//     marginTop = 20, // top margin, in pixels
//     marginRight = 30, // right margin, in pixels
//     marginBottom = 30, // bottom margin, in pixels
//     marginLeft = 40, // left margin, in pixels
//     width = 640, // outer width, in pixels
//     height = 400, // outer height, in pixels
//     xType = d3.scaleUtc, // type of x-scale
//     xDomain, // [xmin, xmax]
//     xRange = [marginLeft, width - marginRight], // [left, right]
//     yType = d3.scaleLinear, // type of y-scale
//     yDomain, // [ymin, ymax]
//     yRange = [height - marginBottom, marginTop], // [bottom, top]
//     zDomain, // array of z-values
//     offset = d3.stackOffsetDiverging, // stack offset method
//     order = d3.stackOrderNone, // stack order method
//     xFormat, // a format specifier string for the x-axis
//     yFormat, // a format specifier for the y-axis
//     yLabel, // a label for the y-axis
//     colors = d3.schemeTableau10, // array of colors for z
//   } = {}) {
//     // Compute values.
//     const X = d3.map(data, x);
//     const Y = d3.map(data, y);
//     const Z = d3.map(data, z);
  
//     // Compute default x- and z-domains, and unique the z-domain.
//     if (xDomain === undefined) xDomain = d3.extent(X);
//     if (zDomain === undefined) zDomain = Z;
//     zDomain = new d3.InternSet(zDomain);
  
//     // Omit any data not present in the z-domain.
//     const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));
  
//     // Compute a nested array of series where each series is [[y1, y2], [y1, y2],
//     // [y1, y2], …] representing the y-extent of each stacked rect. In addition,
//     // each tuple has an i (index) property so that we can refer back to the
//     // original data point (data[i]). This code assumes that there is only one
//     // data point for a given unique x- and z-value.
//     const series = d3.stack()
//         .keys(zDomain)
//         .value(([x, I], z) => Y[I.get(z)])
//         .order(order)
//         .offset(offset)
//       (d3.rollup(I, ([i]) => i, i => X[i], i => Z[i]))
//       .map(s => s.map(d => Object.assign(d, {i: d.data[1].get(s.key)})));
  
//     // Compute the default y-domain. Note: diverging stacks can be negative.
//     if (yDomain === undefined) yDomain = d3.extent(series.flat(2));
  
//     // Construct scales and axes.
//     const xScale = xType(xDomain, xRange);
//     const yScale = yType(yDomain, yRange);
//     const color = d3.scaleOrdinal(zDomain, colors);
//     const xAxis = d3.axisBottom(xScale).ticks(width / 80, xFormat).tickSizeOuter(0);
//     const yAxis = d3.axisLeft(yScale).ticks(height / 50, yFormat);
  
//     const area = d3.area()
//         .x(({i}) => xScale(X[i]))
//         .y0(([y1]) => yScale(y1))
//         .y1(([, y2]) => yScale(y2));
  
//     const svg = d3.create("svg")
//         .attr("width", width)
//         .attr("height", height)
//         .attr("viewBox", [0, 0, width, height])
//         .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
//     svg.append("g")
//         .attr("transform", `translate(${marginLeft},0)`)
//         .call(yAxis)
//         .call(g => g.select(".domain").remove())
//         .call(g => g.selectAll(".tick line").clone()
//             .attr("x2", width - marginLeft - marginRight)
//             .attr("stroke-opacity", 0.1))
//         .call(g => g.append("text")
//             .attr("x", -marginLeft)
//             .attr("y", 10)
//             .attr("fill", "currentColor")
//             .attr("text-anchor", "start")
//             .text(yLabel));
  
//     svg.append("g")
//       .selectAll("path")
//       .data(series)
//       .join("path")
//         .attr("fill", ([{i}]) => color(Z[i]))
//         .attr("d", area)
//       .append("title")
//         .text(([{i}]) => Z[i]);
  
//     svg.append("g")
//         .attr("transform", `translate(0,${height - marginBottom})`)
//         .call(xAxis);
  
//     return Object.assign(svg.node(), {scales: {color}});
//   }