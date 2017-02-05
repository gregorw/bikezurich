var Trend = (function(window, d3) {

  var svg, data, x, y, xAxis, yAxis, dim, chartWrapper, values, valuesPath, trend, trendPath, margin = {}, width, height;

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
    svg = d3.select('#trend');
    chartWrapper = svg.append('g');
    trendPath = chartWrapper.append('path').datum(data).classed('trend', true);
    valuesPath = chartWrapper.append('path').datum(data.filter(function(d) {
      return d.value != 0;
    })).classed('values', true);
    chartWrapper.append('g').classed('x axis', true);
    chartWrapper.append('g').classed('y axis', true);

    // render the chart
    render();
  }

  function render() {

    // get dimensions based on window size
    updateDimensions(window.innerWidth);

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
  }

  function updateDimensions(winWidth) {
    margin.top = 20;
    margin.right = 50;
    margin.left = 50;
    margin.bottom = 50;

    goldenRatio = 1.61803399;
    width = winWidth - margin.left - margin.right;
    height = width / goldenRatio;
  }

  return {
    render : render
  }

})(window,d3);

window.addEventListener('resize', Trend.render);
