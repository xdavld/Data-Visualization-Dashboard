/* Refer to https://gionkunz.github.io/chartist-js/examples.html for setting up the graphs */

var mainChart = new Chartist.Line(
  "#chart1",
  {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    series: [
      [1, 5, 2, 5, 4, 3],
      [2, 3, 4, 8, 1, 2],
      [5, 4, 3, 2, 1, 0.5],
    ],
  },
  {
    low: 0,
    showArea: true,
    showPoint: false,
    fullWidth: true,
  }
);

mainChart.on("draw", function (data) {
  if (data.type === "line" || data.type === "area") {
    data.element.animate({
      d: {
        begin: 1000 * data.index,
        dur: 1000,
        from: data.path
          .clone()
          .scale(1, 0)
          .translate(0, data.chartRect.height())
          .stringify(),
        to: data.path.clone().stringify(),
        easing: Chartist.Svg.Easing.easeOutQuint,
      },
    });
  }
});

var chartScatter = new Chartist.Line(
  "#chart2",
  {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    series: [
      [12, 9, 7, 8, 5, 4, 6, 2, 3, 3, 4, 6],
      [4, 5, 3, 7, 3, 5, 5, 3, 4, 4, 5, 5],
      [5, 3, 4, 5, 6, 3, 3, 4, 5, 6, 3, 4],
      [3, 4, 5, 6, 7, 6, 4, 5, 6, 7, 6, 3],
    ],
  },
  {
    low: 0,
  }
);

chartScatter.on("draw", function (data) {
  if (data.type === "line" || data.type === "area") {
    data.element.animate({
      d: {
        begin: 500 * data.index,
        dur: 1000,
        from: data.path
          .clone()
          .scale(1, 0)
          .translate(0, data.chartRect.height())
          .stringify(),
        to: data.path.clone().stringify(),
        easing: Chartist.Svg.Easing.easeOutQuint,
      },
    });
  }
});

var chartBar = new Chartist.Bar(
  "#chart3",
  {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    series: [
      [800000, 1200000, 1400000, 1300000],
      [200000, 400000, 500000, 300000],
      [100000, 200000, 400000, 600000],
    ],
  },
  {
    stackBars: true,
    axisY: {
      labelInterpolationFnc: function (value) {
        return value / 1000 + "k";
      },
    },
  }
);

chartBar.on("draw", function (data) {
  if (data.type === "bar") {
    data.element.attr({
      style: "stroke-width: 30px",
    }),
      data.element.animate({
        y2: {
          dur: "0.5s",
          from: data.y1,
          to: data.y2,
        },
      });
  }
});

var chartPie = new Chartist.Pie(
  "#chart4",
  {
    series: [10, 20, 50, 20, 5, 50, 15],
    labels: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    donut: true,
    showLabel: true,
  }
);

chartPie.on("draw", function (data) {
  if (data.type === "slice") {
    var pathLength = data.element._node.getTotalLength();
    data.element.attr({
      "stroke-dasharray": pathLength + "px " + pathLength + "px",
    });

    var animationDefinition = {
      "stroke-dashoffset": {
        id: "anim" + data.index,
        dur: 200,
        from: -pathLength + "px",
        to: "0px",
        easing: Chartist.Svg.Easing.easeOutQuint,
        fill: "freeze",
      },
    };

    if (data.index !== 0) {
      animationDefinition["stroke-dashoffset"].begin =
        "anim" + (data.index - 1) + ".end";
    }

    data.element.attr({
      "stroke-dashoffset": -pathLength + "px",
    });

    data.element.animate(animationDefinition, false);
  }
});
