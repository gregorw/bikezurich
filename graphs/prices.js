var svg = d3.select("#prices"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%d-%b-%y");

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

var trend = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.trend); });



d3.csv("data/overall_counts_per_year_with_trends.csv", function(d) {
  d.date = new Date(d.year);
  d.close = +d.all_x;
  d.trend = +d.all_y;
  return d;
}, function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.trend; }));

  g.append("line")
    .attr("x1", x(new Date("2013")))
    .attr("y1", y(1))
    .attr("x2", x(new Date("2025")))
    .attr("y2", y(2))
    .attr("stroke", "gray")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", 5);

 g.append("line")
    .attr("x1", x(new Date("2025")))
    .attr("y1", y(0))
    .attr("x2", x(new Date("2025")))
    .attr("y2", y(2))
    .attr("stroke", "gray")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", 5);

    g.append("line")
    .attr("x1", x(new Date("2011")))
    .attr("y1", y(2))
    .attr("x2", x(new Date("2025")))
    .attr("y2", y(2))
    .attr("stroke", "gray")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", 5);

  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // y axis
  g.append("g")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Growth");

  var filteredData = data.filter(function(d) {
      return d.close != 0;
  });
  g.append("path")
      .datum(filteredData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2)
      .attr("d", line);

  g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2)
      .attr("d", trend);
});
