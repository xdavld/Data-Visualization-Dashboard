document.addEventListener("DOMContentLoaded", function () {
  //SCATTERPLOT
  d3.csv(
    "https://gist.githubusercontent.com/xdavld/ba3141ee7811703e68f6d1c10ab3417c/raw/1c71b67aa7d40b49fc08db132d5087e814eadcfb/mean_arrival_delay.csv",
    function (rows) {
      //Arrays für die Airlines und die Traces
      var traces = [];
      var airlines = [];
      var linecolor = {};

      rows.forEach(function (row) {
        var airline = row.AIRLINE;
        var i = airlines.indexOf(airline);
  
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

        if (linecolor[airline]) {
          traces.push({
            x: [linecolor[airline].delay, delay],
            y: [linecolor[airline].month, row.MONTH],
            mode: "lines",
            line: { color: color },
            name: airline,
            showlegend: false,
          });
        }
        linecolor[airline] = { delay: delay, month: row.MONTH };

        traces.push({
          x: [delay],
          y: [row.MONTH],
          mode: "markers",
          marker: { color: color },
          name: airline,
          showlegend: false,
          hoverinfo: "none",
        });

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

      // Chart zeichnen
      Plotly.newPlot("chart1", traces, layout, {
        displayModeBar: false,
      });

      //JAVASCRIPT
      // Dash Boxen anpassen mit JavaScript
      var dashContent = document.getElementById("dash-content");
      var airlineBox = dashContent.querySelector(".text-3xl");
      var delayBox = dashContent.querySelectorAll(".text-3xl")[1];

      var scatterPlot = document.getElementById("chart1");
      scatterPlot.on("plotly_hover", function (eventData) {
        var hoveredTrace = eventData.points[0].curveNumber;
        var tracesToChange = [];
        for (var i = 0; i < scatterPlot.data.length; i++) {
          if (
            scatterPlot.data[i].name === scatterPlot.data[hoveredTrace].name
          ) {
            tracesToChange.push(i);
          }
        }
        Plotly.restyle(scatterPlot, "opacity", 0.1);
        Plotly.restyle(scatterPlot, "opacity", 1, tracesToChange);
      });

      scatterPlot.on("plotly_unhover", function () {
        Plotly.restyle(scatterPlot, "opacity", 1);
      });

      // Hover Effekt
      document.getElementById("chart1").on("plotly_hover", function (data) {
        var pointData = data.points[0];
        var timeFormat;
        if (pointData.x >= 0) {
          timeFormat =
            "+" +
            d3.format("02d")(Math.floor(pointData.x / 60)) +
            ":" +
            d3.format("02d")(Math.floor(pointData.x % 60));
        } else {
          timeFormat =
            "-" +
            d3.format("02d")(Math.abs(pointData.x / 60)) +
            ":" +
            d3.format("02d")(Math.abs(Math.floor(pointData.x % 60)));
        }

        // Javascript Elemente anpassen
        airlineBox.innerText = pointData.data.name;
        delayBox.innerText = timeFormat;
      });
      // Hover Effekt entfernen
      document.getElementById("chart1").on("plotly_unhover", function (data) {
        // Javascript Elemente anpassen
        airlineBox.innerText = "---";
        delayBox.innerText = "---";
      });
    }
  );
});
