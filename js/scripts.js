var svg = d3.select("svg"),
    margin = {top: 20, right: 30, bottom: 150, left: 30},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.4),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/bar-data.csv", function(d) {
  d.result = +d.result;
  return d;
}, function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.business; }));
  y.domain([0, d3.max(data, function(d) { return d.result; })]);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
    .attr("y", 0)
    .attr("x", 8)
    .attr("dy", ".3em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start")
    .style("font-size","8px")
    .style("fill","white");
  
  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10))
    .append("text")
      .attr("transform", "rotate(-90)")
      .style("fill", "white")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Probility")
      .style("fill", "white");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.business); })
      .attr("y", function(d) { return y(d.result); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.result); })
      .text(function(d) { return d.result; })
      .on("mouseover", function(d){tooltip.text(d.business+": "+d.result +"%"); return tooltip.style("visibility", "visible");})
      .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
      // .on('click', function(d) {    
      //   //alert(d.business)  
      //   if (feature.properties.name == d.business){

      //   }

      })
});

      



//Create tooltip for D3 chart
var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "white")
    .style("opacity", ".8")
    .text("a simple tooltip");

//Creat change of style, when click on D3 chart, change color of geojson polygons with same business name:












var highlightStyle = {
    color: '#2262CC', 
    weight: 3,
    opacity: 0.6,
    fillOpacity: 0.65,
    fillColor: '#2262CC'
};

// instantiate the map object
var map = L.map('map').setView([40.735021, -73.994787], 13);

//add a dark basemap from carto's free basemaps
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
}).addTo(map);



$.getJSON('data/Location.geojson', function(jqueryData) {

  L.geoJson(fast_rest,{
    color:'white',
    fillOpacity: 0.1,
    weight:0.5,
    onEachFeature: onEachFeature
  }).addTo(map);  
}) // this is the end of the $.getJSON callback


///Interactions:
function highlightFeature(e) {
    var layer = e.target;
    
    layer.setStyle({
        weight: 2,
        color: 'orange',
        dashArray: '',
        fillOpacity: 0
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();

    info.update(layer.feature.properties);
    }
}

function resetHighlight(e) {
  var geojson;
  geojson = L.geoJson(fast_rest);
  geojson.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}


///Add interactive legend;
var info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

///method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Health Inspection Grade</h4>' +  (props ?
        '<b>' + props.business + '</b><br />' + props.inspection + ' inspections, ' + props.grade + ' % chance to get A'
        : 'Hover over a store, click to zoom in.');
};
info.addTo(map);


var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 25, 50, 75,100],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};
//legend.addTo(map);

///////////////////////////////////////////////////////
// Click button to reset back:



