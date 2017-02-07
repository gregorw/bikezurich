var Trend = (function(window, d3) {

  var parent, svg, data, x, y, xAxis, yAxis, dim, chartWrapper, values, valuesPath, trend, trendPath, line, line2xPath, line2025Path, margin = {}, width, height;

  // load data, then initialize chart
  d3.csv('data/overall_counts_per_year_with_trends.csv', convert, init);

  function convert(d) {
    d.date = new Date(d.year);
    d.value = +d.all_x;
    d.trend = +d.all_y;
    return d;
  }
  
  // called once the data is loaded
  function init(data) {
    // initialize scales
    xExtent = d3.extent(data, function(d) { return d.date });
    yExtent = d3.extent(data, function(d) { return d.trend });
    x = d3.scaleTime().rangeRound([0, width]).domain(xExtent);
    y = d3.scaleLinear().rangeRound([height, 0]).domain(yExtent);

    // initialize axis
    xAxis = d3.axisBottom();
    yAxis = d3.axisLeft();

    // the path generator for the line chart
    values = d3.line()
      .x(function(d) { return x(d.date) })
      .y(function(d) { return y(d.value) });

    trend = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.trend); });

    // initialize svg
    parent = document.getElementById('trend');
    svg = d3.select(parent).append('svg');
    chartWrapper = svg.append('g');
    helpers = chartWrapper.append('g');
    valuesPath = chartWrapper.append('path').datum(data.filter(function(d) {
      return d.value != 0;
    })).classed('values', true);
    trendPath = chartWrapper.append('path').datum(data).classed('trend', true);
    chartWrapper.append('g').classed('x axis', true);
    chartWrapper.append('g').classed('y axis', true)
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Growth");

    line2xData = [{ year: "2011", factor: 2.0 }, { year: "2029", factor: 2.0 }];
    line2025Data = [{ year: "2025", factor: 0.96 }, { year: "2025", factor: 2.1 }];
    goalData = [{ year: "2013", factor: 1 }, { year: "2025", factor: 2 }]
    line = d3.line()
      .x(function(d) { return x(new Date(d.year)); })
      .y(function(d) { return y(d.factor); })
    line2xPath = helpers.append("path").datum(line2xData).classed('line', true);
    line2025Path = helpers.append("path").datum(line2025Data).classed('line', true);
    goalPath = helpers.append("path").datum(goalData).classed('line', true);

    // render the chart
    render();
  }

  function render() {

    // get dimensions
    updateDimensions();

    // update x and y scales to new dimensions
    x.range([0, width]);
    y.range([height, 0]);

    // update svg elements to new dimensions
    svg
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom);
    chartWrapper.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // update the axis and line
    xAxis.scale(x);
    yAxis.scale(y);

    svg.select('.x.axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    svg.select('.y.axis')
      .call(yAxis);

    valuesPath.attr('d', values);
    trendPath.attr('d', trend);
    line2xPath.attr('d', line);
    line2025Path.attr('d', line);
    goalPath.attr('d', line);

  }

  function updateDimensions() {
    parentWidth = parent.getBoundingClientRect()['width'];
    margin.top = 20;
    margin.right = 40;
    margin.left = 40;
    margin.bottom = 40;

    goldenRatio = 1.61803399;
    width = parentWidth - margin.left - margin.right;
    height = width / goldenRatio;
  }

  return {
    render : render
  }

})(window,d3);

window.addEventListener('resize', Trend.render);
