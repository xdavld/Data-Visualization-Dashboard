document.addEventListener("DOMContentLoaded", function () {
  var delayTypeSelect = document.getElementById("delay-type");
  var h31 = document.getElementById("h3-1");
  var h51 = document.getElementById("h5-1");
  var h32 = document.getElementById("h3-2");
  var h52 = document.getElementById("h5-2");
  var h33 = document.getElementById("h3-3");
  var h53 = document.getElementById("h5-3");
  var h34 = document.getElementById("h3-4");
  var h54 = document.getElementById("h5-4");
  var airlinetype = document.getElementById("airline-type");
  
  function updateData(delayType) {
    d3.csv(
      "https://gist.githubusercontent.com/xdavld/a1252aa0606d4af3cf3f3fe3f8ad027c/raw/7a7ee3a61086b4875b8193170ef31ea71134ca31/airport_map.csv",
      function (err, rows) {
        function unpack(rows, key) {
          return rows.map(function (row) {
            return row[key];
          });
        }

        var airport = unpack(rows, "AIRPORT"),
          delay = unpack(rows, delayType),
          airportLat = unpack(rows, "ORIGIN_LAT"),
          airportLon = unpack(rows, "ORIGIN_LON"),
          airportSize = [],
          hoverText = [];

        for (var i = 0; i < delay.length; i++) {
          var currentSize = delay[i];
          if (currentSize > 0) {
            var currentText =
              airport[i] + " Verspätungszeit: " + delay[i] + " Minuten";
            airportSize.push(currentSize * 0.3);
            hoverText.push(currentText);
          }
        }

        var data = [
          {
            type: "scattergeo",
            locationmode: "USA-states",
            lat: airportLat,
            lon: airportLon,
            hoverinfo: "text",
            text: hoverText,
            marker: {
              size: airportSize,
              color: 'red',
              line: {
                color: "black",
                width: 1,
              },
            },
          },
        ];

        var layout = {
          showlegend: false,
          plot_bgcolor: "rgba(0,0,0,0)",
          paper_bgcolor: "rgba(0,0,0,0)",
          margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
          },
          geo: {
            scope: "usa",
            projection: {
              type: "albers usa",
            },
            showland: true,
            landcolor: "rgb(217, 217, 217)",
            subunitwidth: 1,
            countrywidth: 1,
            subunitcolor: "rgb(255,255,255)",
            countrycolor: "rgb(255,255,255)",
            bgcolor: "rgba(0,0,0,0)",
          },
        };

        Plotly.newPlot(
          "chart5",
          data,
          layout,
          { showLink: false },
          { displayModeBar: false }
        );
      }
    );
  }

delayTypeSelect.addEventListener("change", function () {
  updateData(delayTypeSelect.value);
});

updateData(delayTypeSelect.value);
  delayTypeSelect.addEventListener("change", function () {
    var selectedValue = delayTypeSelect.value;
    if (selectedValue === "MEAN_DEPARTURE_DELAY") {
      h31.textContent = "223 [min]";
      h51.textContent = "Nummer 1: LAW";
      h32.textContent = "136 [min]";
      h52.textContent = "Nummer 2: DVL";
      h33.textContent = "116 [min]";
      h53.textContent = "Nummer 3: LMT";
      h34.textContent = "111 [min]";
      h54.textContent = "Nummer 4: JMS";
      airlinetype.value = "---";
    } else if (selectedValue === "MEAN_DESTINATION_DELAY") {
      h31.textContent = "123 [min]";
      h51.textContent = "Nummer 1: DVL";
      h32.textContent = "121 [min]";
      h52.textContent = "Nummer 2: JMS";
      h33.textContent = "120 [min]";
      h53.textContent = "Nummer 3: PLN";
      h34.textContent = "78 [min]";
      h54.textContent = "Nummer 4: LAW";
      airlinetype.value = "---";
    }
  });

  d3.csv(
    "https://gist.githubusercontent.com/xdavld/c0490fc7d9fe3fea278102338155dd44/raw/088160c2500a1dabbb7d512710ccc1a86ce45785/flugrouten.csv",
    function (err, rows) {
      // Add an event listener to the select element
      d3.select("#airline-type").on("change", function () {
        // Get the value of the selected option
        var selectedAirline = this.value;

        if (selectedAirline === "---") {
          updateVisualization(filteredRows === []);
        } else {
          var filteredRows = rows.filter(function (row) {
            return row["AIRLINE"] === selectedAirline;
          });
          updateVisualization(filteredRows);
        }
      });

      function unpack(rows, key) {
        return rows.map(function (row) {
          return row[key];
        });
      }

      function getMaxOfArray(numArray) {
        return Math.max.apply(null, numArray);
      }

      function updateVisualization(rows) {
        var data = [];
        var count = unpack(rows, "AIR");
        var startLongitude = unpack(rows, "ORIGIN_AIRPORT_LON");
        var endLongitude = unpack(rows, "DESTINATION_AIRPORT_LON");
        var startLat = unpack(rows, "ORIGIN_AIRPORT_LAT");
        var endLat = unpack(rows, "DESTINATION_AIRPORT_LAT");

        for (var i = 0; i < count.length; i++) {
          var opacityValue = count[i] / getMaxOfArray(count);

          var result = {
            type: "scattergeo",
            locationmode: "USA-states",
            lon: [startLongitude[i], endLongitude[i]],
            lat: [startLat[i], endLat[i]],
            mode: "lines",
            line: {
              width: 0.5,
              color: "red",
            },
            opacity: opacityValue,
          };

          data.push(result);
        }
        Plotly.newPlot("chart5", data, layout, { showLink: false });
      }

      var layout = {
        showlegend: false,
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        margin: {
          l: 0,
          r: 0,
          b: 0,
          t: 0,
        },
        geo: {
          scope: "usa",
          projection: {
            type: "albers usa",
          },
          showland: true,
          landcolor: "rgb(217, 217, 217)",
          subunitwidth: 1,
          countrywidth: 1,
          subunitcolor: "rgb(255,255,255)",
          countrycolor: "rgb(255,255,255)",
          bgcolor: "rgba(0,0,0,0)",
        },
      };

    }
  );

});



