function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(newSample => newSample.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function - sample is selected from the dropdown menu
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. AT
  var samplesarray = data.samplesarray;
    // 4. Create a variable that holds an array that contains the data for the object that was chosen from the dropdown (sample) AT
  var sampledata = samplesarray.filter(samples => samples.id == sample);
 
    //  5. Create a variable that holds the first sample in the array. AT
  var firstinarray = sampledata[0];

    // 6. Create variables that have arrays for otu_ids, otu_labels, and sample_values. AT
  var otuids = [otu_ids]; 
  var otulabels = [otu_labels];
  var samplevalues = [sample_values];

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    // -------use slice, map, and reverse functions------
    // so the otu_ids with the most bacteria are last. AT
    var yticks = otuids.slice(0, 10);

    // 8. Create the trace for the bar chart. AT
    // sample_values as the values, otu_ids as the labels, and otu_labels as the hover text
    var barData = {
        values: samplevalues,
        labels: otuids,
        //hovermode = otulabels,
        type: "bar"
    };
    // 9. Create the layout for the bar chart.  AT
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found",

     
    };
    // 10. Use Plotly.newpPlot() to plot the data with the layout. AT
    Plotly.newPlot("bar", barData, barLayout);
  });
}
