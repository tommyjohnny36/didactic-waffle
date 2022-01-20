// makes sure we have all data transferred before drawing the graphs
queue()
    .defer(d3.json, "/data")
    .await(makeGraphs);

function makeGraphs(error, recordsJson) {
    //make sure latitude and longitude are numeric

    var records = recordsJson
    var dateFormat = d3.time.format("%Y-%m-%d %H:%M:%S");

    console.log(records)

    records.forEach(function(d) {


        d["Longitude"] = +d["Longitude"];
        d["Latitude"] = +d["Latitude"];
    });

    // create crossfilter instance
    var ndx = crossfilter(records);
    

    var stateDim = ndx.dimension(function(d) { return d["State"]; });
    var genderDim = ndx.dimension(function(d) { return d["Sex"]; });
    var ageGroupDim = ndx.dimension(function(d) { return d["age_group"]; });
    var monthDim = ndx.dimension(function(d) { return d["Month"]; });
    var vehicleDim = ndx.dimension(function(d) { return d["top_5_vehicles"]; });
    var allDim = ndx.dimension(function(d) {return d;});

    console.log(genderDim.top(Infinity))


    // define the data groups
    var numRecordsByMonth = monthDim.group();
    var stateGroup = stateDim.group();
    var genderGroup = genderDim.group();
    var ageSegmentGroup = ageGroupDim.group();
    var vehicleBrandGroup = vehicleDim.group();
    var all = ndx.groupAll();

    console.log(genderGroup.top(Infinity))
    
    //Define values (to be used in charts)
    
	var minMonth = monthDim.bottom(1)[0]["Month"];
	var maxMonth = monthDim.top(1)[0]["Month"];

    var numberRecordsND = dc.numberDisplay("#number-records-nd");
    var monthChart = dc.barChart("#month-chart");
    var genderChart = dc.rowChart("#gender-row-chart");
    var ageSegmentChart = dc.rowChart("#age-segment-row-chart");
    var carBrandChart = dc.rowChart("#car-brand-row-chart");
    var stateChart = dc.rowChart("#state-row-chart");


    numberRecordsND
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d){return d; })
        .group(all);


    
    monthChart
        .width(450)
        .height(140)
        .margins({top: 10, right:50, bottom: 20, left: 20})
        .dimension(monthDim)
        .group(numRecordsByMonth)
        .transitionDuration(500)
        .x(d3.time.scale().domain([minMonth, maxMonth]))
        .elasticY(true)
        .yAxis().ticks(4);

    genderChart
        .width(420)
        .height(100)
        .dimension(genderDim)
        .group(genderGroup)
        .ordering(function(d) {return -d.value})
        .colors(["#6baed6"])
        .elasticX(true)
        .xAxis().ticks(2);

    ageSegmentChart
        .width(420)
        .height(150)
        .dimension(ageGroupDim)
        .group(ageSegmentGroup)
        .colors(["#6baed6"])
        .elasticX(true)
        .labelOffsetY(10)
        .xAxis().ticks(4);

    carBrandChart
        .width(420)
        .height(310)
        .dimension(vehicleDim)
        .group(vehicleBrandGroup)
        .ordering(function(d) { return -d.value})
        .colors(["#6baed6"])
        .elasticX(true)
        .xAxis().ticks(4);


    stateChart
    	.width(300)
		.height(710)
        .dimension(stateDim)
        .group(stateGroup)
        .ordering(function(d) { return -d.value })
        .colors(['#6baed6'])
        .elasticX(true)
        .labelOffsetY(1)
        .xAxis().ticks(2);

    
    var map = L.map('map-id');


    var drawMap = function(){

        map.setView([37.09, -90.71], 2);
		mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
		L.tileLayer(
			'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; ' + mapLink + ' Contributors',
				maxZoom: 15,
			}).addTo(map);

		//HeatMap
		var geoData = [];
		_.each(allDim.top(Infinity), function (d) {
			geoData.push([d["Latitude"], d["Longitude"], 1]);
	      });
		var heat = L.heatLayer(geoData,{
			radius: 10,
			blur: 20, 
			maxZoom: 1,
		}).addTo(map);

	};

    //Draw Map
    drawMap();

    //Update the heatmap if any dc chart get filtered
    dcCharts = [monthChart, genderChart, ageSegmentChart, carBrandChart, stateChart];

    _.each(dcCharts, function (dcChart) {
        dcChart.on("filtered", function (chart, filter) {
            map.eachLayer(function (layer) {
                map.removeLayer(layer)
         }); 
            drawMap();
        });
    });

    dc.renderAll();


}