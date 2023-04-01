document.addEventListener("DOMContentLoaded", function () {
  d3.csv(
    "https://gist.githubusercontent.com/xdavld/ba3141ee7811703e68f6d1c10ab3417c/raw/1c71b67aa7d40b49fc08db132d5087e814eadcfb/mean_arrival_delay.csv",
    function (rows) {
      // create an array of traces, one for each airline
      var traces = [];
      var airlines = [];
      var prevData = {};

      rows.forEach(function (row) {
        var airline = row.AIRLINE;
        var i = airlines.indexOf(airline);
        if (i === -1) {
          i = airlines.length;
          airlines.push(airline);
        }

        if (!traces[i]) {
          traces[i] = {
            x: [],
            y: [],
            mode: "lines+markers",
            line: { color: [] },
            marker: { color: [] },
            name: airline,
          };
        }

        var delay = parseFloat(row.ARRIVAL_DELAY);
        var color;
        if (delay >= 0) {
          color = "rgb(" + (125 + delay * 10) + ", 0, 0)";
        } else {
          color = "rgb(0, " + (125 + delay * -20) + ", 0)";
        }

        if (prevData[airline]) {
          traces.push({
            x: [prevData[airline].delay, delay],
            y: [prevData[airline].month, row.MONTH],
            mode: "lines",
            line: { color: color },
            name: airline,
            showlegend: false,
          });
        }

        traces.push({
          x: [delay],
          y: [row.MONTH],
          mode: "markers",
          marker: { color: color },
          name: airline,
          showlegend: false,
          hoverinfo: "none",
        });

        prevData[airline] = { delay: delay, month: row.MONTH };
      });

      airlines.forEach(function (airline, i) {
        traces.push({
          x: [],
          y: [],
          mode: "lines",
          name: airline,
          showlegend: true,
        });
      });

      var layout = {
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        margin: {
          l: 85,
          r: 10,
          b: 35,
          t: 0,
        },
        xaxis: {
          title: {
            text: "Verspätungszeit der Airlines pro Monat:              <b><- langsamer | schneller -></b>",
            standoff: 10,
          },
          range: [38, -10],
        },
        yaxis: {
          ticktext: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
          tickvals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
        hovermode: "closest",
        hovertemplate: "<b>%{y}</b><br>Delay: %{x} mins",
        height: 800,
      };

      // plot the chart
      var chart = Plotly.newPlot("chart1", traces, layout, {
        displayModeBar: false,
      });

      // select the dash-content div and the two h3 elements
      var dashContent = document.getElementById("dash-content");
      var airlineElement = dashContent.querySelector(".text-3xl");
      var delayElement = dashContent.querySelectorAll(".text-3xl")[1];

      var myPlot = document.getElementById("chart1");
      myPlot.on("plotly_hover", function (eventData) {
        var hoveredTrace = eventData.points[0].curveNumber;
        var tracesToChange = [];
        for (var i = 0; i < myPlot.data.length; i++) {
          if (myPlot.data[i].name === myPlot.data[hoveredTrace].name) {
            tracesToChange.push(i);
          }
        }
        Plotly.restyle(myPlot, "opacity", 0.1);
        Plotly.restyle(myPlot, "opacity", 1, tracesToChange);
      });

      myPlot.on("plotly_unhover", function () {
        Plotly.restyle(myPlot, "opacity", 1);
      });

      // add a hover event to the chart
      document.getElementById("chart1").on("plotly_hover", function (data) {
        // get the data of the hovered point
        var pointData = data.points[0];
        var delayFormatted;
        if (pointData.x >= 0) {
          delayFormatted =
            "+" +
            d3.format("02d")(Math.floor(pointData.x / 60)) +
            ":" +
            d3.format("02d")(Math.floor(pointData.x % 60));
        } else {
          delayFormatted =
            "-" +
            d3.format("02d")(Math.abs(pointData.x / 60)) +
            ":" +
            d3.format("02d")(Math.abs(Math.floor(pointData.x % 60)));
        }

        // update the content of the airline and delay elements
        airlineElement.innerText = pointData.data.name;
        delayElement.innerText = delayFormatted;
      });
      // add a hover event to the chart
      document.getElementById("chart1").on("plotly_unhover", function (data) {
        // update the content of the airline and delay elements
        airlineElement.innerText = "---";
        delayElement.innerText = "---";
      });
    }
  );
});
