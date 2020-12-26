function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json('samples.json').then((data) => {
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
  d3.json('samples.json').then((data) => {
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
  d3.json('samples.json').then((data) => {
    console.log(data);

    // 3. Create a variable that holds the samples array. AT
   var samplesarray = data.samples;

    // 4. Create a variable that holds an array that contains the data for the object that was chosen from the dropdown (sample) AT
   var sampledata = samplesarray.filter(samplesobj => samplesobj.id == sample);
 
    //  5. Create a variable that holds the first sample in the array. AT
   var firstinarray = sampledata[0];

    // 6. Create variables that have arrays for otu_ids, otu_labels, and sample_values. AT
    // adding in washing frequency
   var otu_ids = firstinarray.otu_ids;
   var otu_labels = firstinarray.otu_labels;
   var sample_values = firstinarray.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    // -------use slice, map, and reverse functions------
    // so the otu_ids with the most bacteria are last. AT
   var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // 8. Create the trace for the bar chart. AT
    // sample_values as the values, otu_ids as the labels, and otu_labels as the hover text
   var barData = [{
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        orientation: "h",
        //hovermode = otulabels,
        marker: {color: 'rgb(0, 153, 0)'},
        type: "bar"
    }];
    // 9. Create the layout for the bar chart.  AT
    var barLayout = {
        title: "<b>Top 10 Bacteria Cultures Found</b>",
        margin: { t: 30, l: 150 },
        font: { color: "green"}
     
    };
    // 10. Use Plotly.newpPlot() to plot the data with the layout. AT
    Plotly.newPlot("bar", barData, barLayout);

// Bubble Chart------------------ 
// 1. Create the trace for the bubble chart.
   var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
     }
    ];

// 2. Create the layout for the bubble chart.
   var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      name: "OTU ID",
     // margin:  
      height: 500,
      xaxis: {title: "<b>OTU ID</b>"},
      hovermode: otu_labels,
      showlegend: false,
      font: { color: "green"}
};

// 3. Use Plotly to plot the data with the layout.
   Plotly.newPlot("bubble", bubbleData, bubbleLayout);

// Gauge Chart ----------------
// 
// 1. Create a variable that filters the metadata array for an object in the array whose id property matches
// the ID number passed into buildCharts() function as the argument.
var gaugeArray = data.metadata;
var gaugedata = gaugeArray.filter(samplesobj => samplesobj.id == sample);

// 2. Create a variable that holds the first sample in the array created
var firstinarraygauge = gaugedata[0];

// 3. Variable that contains converts the washing frequency to a floating point number
var frequency = parseFloat(firstinarraygauge.wfreq);
console.log(frequency);

// 4. Create the trace for the gauge chart.
   var gaugeData = [ 
      {
      value: frequency,
      type: "indicator",
      mode: "gauge+number",
      title: { text: "<b>Belly Button Washing Frequency</b>"},
      gauge: {
        axis: { range: [null, 10], tickwidth: 1},
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red"},
          { range: [2, 4], color: "orange"},
          { range: [4, 6], color: "yellow"},
          { range: [6, 8], color: "lime"},
          { range: [8, 10], color: "green"}],        
        threshold: {
          value: 10
        }

      }
    }];

// 5. Create the layout for the gauge chart.
   var gaugeLayout = { 
      xaxis: { title: "Scrubs per Week"},  
      width: 450,
      height: 450,
      font: { color: "green"}
 
   };

// 6. Use Plotly to plot the gauge data and layout.
Plotly.newPlot("gauge", gaugeData, gaugeLayout);

});
}