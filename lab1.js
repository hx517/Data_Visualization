<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.2.3/d3.min.js"></script>
  <script src="https://d3js.org/d3-scale-chromatic.v1.min.js"> </script>
  <title>JS Bin</title>
<style id="jsbin-css">
.zipcode {
  stroke: black;
  stroke-width: 1px;
  fill: none;
}
</style>
</head>
<body>
 <div id="chart">
   <svg width="650" height="650">
   </svg>
  </div>
<script id="jsbin-javascript">
var ZIPCODE_URL =
  "https://raw.githubusercontent.com/hvo/datasets/master/nyc_zip.geojson";
var RES_BY_CUISINE_URL =
  "https://raw.githubusercontent.com/hvo/datasets/master/nyc_restaurants_by_cuisine.json";
d3.queue()
  .defer(d3.json, ZIPCODE_URL)
  .defer(d3.json, RES_BY_CUISINE_URL)
  .await(createChart);
function createChart(error, zipcodes, byCuisine) {
  //console.log(byCuisine[0])
  var svg        = d3.select("svg"),
      gMap       = svg.append("g"),
      canvasSize = [650,650],
      projection = d3.geoMercator()
                       .scale(Math.pow(2,16))
                       .center([-73.975,40.7])
                       .translate([canvasSize[0]/2, canvasSize[1]/2]),
      path       = d3.geoPath()
                     .projection(projection);
  
  gMap.selectAll(".zipcode")
     .data(zipcodes.features)
     .enter().append("path")
       .attr("class", "zipcode")
       .attr("d", path);
//new
  var counts   = byCuisine[1].perZip,
      data     = Object.entries(counts),
      maxCount = d3.max(data, d => d[1]),  //function(d) {return d[1]; }
      color    = d3.scaleThreshold()
                   .domain(d3.range(0, maxCount, maxCount/5))
                   .range(d3.schemeBlues[5])
      zc       = gMap.selectAll(".zipcode")
                   .data(data, d=> (d[0]?d[0]:d.properties.zipcode));
  zc.style("fill", d => color(d[1]));
  
}
// Vo's code
// myKey(data[0]) -> zip code -> data[0][0]
// myKey(zipcode.features[0]) -> zip code ->zipcodes.features[0].properties.zipcode
// myKey([10471, 10]) -> 10471
// myKey({"properties": {"zipcode:10471}}) -> 10471
function myKey(d) {
  return (d[0]?d[0]:d.properties.zipcode);
}
</script>


</body>
</html>
