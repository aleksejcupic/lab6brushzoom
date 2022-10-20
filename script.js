d3.csv('unemployment.csv', d3.autoType).then(data => {
    console.log(data);
    // var sum = data.
    // Wholesale and Retail Trade,
    // Manufacturing,
    // Leisure and hospitality,
    // Business services,
    // Construction,
    // Education and Health,
    // Government,
    // Finance,
    // Self-employed,
    // Other,
    // Transportation and Utilities,
    // Information,
    // Agriculture,
    // Mining and Extraction
});

// input: selector for a chart container e.g., ".chart"
function AreaChart(container){

	// initialization

	function update(data){ 

		// update scales, encodings, axes (use the total count)
		
	}

	return {
		update // ES6 shorthand for "update": update
	};
}

