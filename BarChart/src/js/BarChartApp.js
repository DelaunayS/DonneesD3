const dataUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let dataJson, dateAndvalue, yScale, xScale, x_AxisScale, y_AxisScale;
const margin = { top: 50, right: 30, bottom: 10, left: 70 },
  width = 800,
  height = 600;
let svgContainer = d3.select("#graphContainer");
const drawSvgContainer = () => {
    svgContainer.attr("width", 800).attr("height", 600);
  },
  propertyScales = () => {
    let t = dateAndvalue.map((t) => t[1]);
    (yScale = d3
      .scaleLinear()
      .domain([0, d3.max(t)])
      .range([0, 600 - margin.top - margin.bottom])),
      (y_AxisScale = d3
        .scaleLinear()
        .domain([0, d3.max(t)])
        .range([600 - margin.top, margin.bottom]));
    let a = dateAndvalue.map((t) => new Date(t[0]));
    (xScale = d3
      .scaleLinear()
      .domain([0, dateAndvalue.length - 1])
      .range([margin.left, 800 - margin.right])),
      (x_AxisScale = d3
        .scaleTime()
        .domain([d3.min(a), d3.max(a)])
        .range([margin.left, 800 - margin.right]));
  },
  drawBars = () => {
    svgContainer
      .selectAll("rect")
      .data(dateAndvalue)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("width", (800 - margin.left - margin.right) / dateAndvalue.length)
      .attr("data-date", (t) => t[0])
      .attr("data-gdp", (t) => t[1])
      .attr("height", (t) => yScale(t[1]))
      .attr("x", (t, a) => xScale(a))
      .attr("y", (t) => 600 - margin.top - yScale(t[1]))
      .on("mouseover", (t, a) => {
        tooltip
          .transition()
          .style("opacity", 0.9)
          .style("top", t.pageY - margin.top - margin.bottom + "px")
          .style("left", t.pageX + 10 + "px"),
          tooltip.html(a[1] + " Billion(s)</br>" + afficheDate(a[0])),
          document.querySelector("#tooltip").setAttribute("data-date", a[0]);
      })
      .on("mouseout", (t) => {
        tooltip.transition().style("opacity", 0);
      });
  },
  nameAxes = () => {
    svgContainer
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -300)
      .attr("y", margin.right / 2)
      .style("font-size", 16)
      .text("Produit intérieur brut en billions de $"),
      svgContainer
        .append("text")
        .attr("x", 400)
        .attr("y", 600 - margin.bottom / 2)
        .style("font-size", 16)
        .text("Année");
  },
  createAxes = () => {
    let t = d3.axisBottom(x_AxisScale),
      a = d3.axisLeft(y_AxisScale);
    svgContainer
      .append("g")
      .call(t)
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + (600 - margin.top) + ")"),
      svgContainer
        .append("g")
        .call(a)
        .attr("id", "y-axis")
        .attr("transform", "translate(" + margin.left + ",0)");
  };
d3.json(dataUrl).then(function (t) {
  (dateAndvalue = t.data),
    svgContainer.attr("width", 800).attr("height", 600),
    propertyScales(),
    svgContainer
      .selectAll("rect")
      .data(dateAndvalue)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("width", (800 - margin.left - margin.right) / dateAndvalue.length)
      .attr("data-date", (t) => t[0])
      .attr("data-gdp", (t) => t[1])
      .attr("height", (t) => yScale(t[1]))
      .attr("x", (t, a) => xScale(a))
      .attr("y", (t) => 600 - margin.top - yScale(t[1]))
      .on("mouseover", (t, a) => {
        tooltip
          .transition()
          .style("opacity", 0.9)
          .style("top", t.pageY - margin.top - margin.bottom + "px")
          .style("left", t.pageX + 10 + "px"),
          tooltip.html(a[1] + " Billion(s)</br>" + afficheDate(a[0])),
          document.querySelector("#tooltip").setAttribute("data-date", a[0]);
      })
      .on("mouseout", (t) => {
        tooltip.transition().style("opacity", 0);
      }),
    svgContainer
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -300)
      .attr("y", margin.right / 2)
      .style("font-size", 16)
      .text("PIB en billions de $"),
    svgContainer
      .append("text")
      .attr("x", 400)
      .attr("y", 600 - margin.bottom / 2)
      .style("font-size", 16)
      .text("Année"),
    createAxes();
});
const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0),
  afficheDate = (t) => {
    let a = t.toString().split("-");
    return "01" === a[1]
      ? a[0] + " trimestre 1"
      : "04" === a[1]
      ? a[0] + " trimestre 2"
      : "07" === a[1]
      ? a[0] + " trimestre 3"
      : a[0] + " trimestre 4";
  };
