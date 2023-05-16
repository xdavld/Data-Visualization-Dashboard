//An folgender Dokumentation orientiert: https://plotly.com/javascript/bubble-maps/ und https://plotly.com/javascript/lines-on-maps/

document.addEventListener("DOMContentLoaded", function () {
  //Variablen definieren für Javascript Änderungen
  var delayAirport = document.getElementById("delay-type");
  var h31 = document.getElementById("h3-1");
  var h51 = document.getElementById("h5-1");
  var h32 = document.getElementById("h3-2");
  var h52 = document.getElementById("h5-2");
  var h33 = document.getElementById("h3-3");
  var h53 = document.getElementById("h5-3");
  var h34 = document.getElementById("h3-4");
  var h54 = document.getElementById("h5-4");
  var airlinetype = document.getElementById("airline-type");

  //MAP - AIRPORTS
  function updateData(delayType) {
    d3.csv(
      "https://gist.githubusercontent.com/xdavld/a1252aa0606d4af3cf3f3fe3f8ad027c/raw/7a7ee3a61086b4875b8193170ef31ea71134ca31/airport_map.csv",
      function (err, rows) {
        function unpack(rows, key) {
          return rows.map(function (row) {
            return row[key];
          });
        }

        //Daten setzen aus CSV
        var airport = unpack(rows, "AIRPORT"),
          delay = unpack(rows, delayType),
          airportLat = unpack(rows, "ORIGIN_LAT"),
          airportLon = unpack(rows, "ORIGIN_LON"),
          airportSize = [],
          hoverText = [];

        //Größe der Punkte setzen
        for (var i = 0; i < delay.length; i++) {
          var currentSize = delay[i];
          if (currentSize > 0) {
            var currentText =
              airport[i] + " Verspätungszeit: " + delay[i] + " Minuten";
            airportSize.push(currentSize * 0.3);
            hoverText.push(currentText);
          }
        }

        //Daten für die Map setzen
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
              color: "red",
              line: {
                color: "black",
                width: 1,
              },
            },
          },
        ];

        //Layout für die Map setzen
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

        //Map zeichnen
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

  //JAVA SCRIPT
  delayAirport.addEventListener("change", function () {
    updateData(delayAirport.value);
  });

  //Updaten der JavaSCript Daten
  updateData(delayAirport.value);
  delayAirport.addEventListener("change", function () {
    var selectedValue = delayAirport.value;
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

  //MAP - FLUGROUTEN
  d3.csv(
    "https://gist.githubusercontent.com/xdavld/c0490fc7d9fe3fea278102338155dd44/raw/088160c2500a1dabbb7d512710ccc1a86ce45785/flugrouten.csv",
    function (err, rows) {
      d3.select("#airline-type").on("change", function () {
        // Anzeigen der ausgewählten Airline
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

      //Daten aus CSV setzen
      function unpack(rows, key) {
        return rows.map(function (row) {
          return row[key];
        });
      }

      //Maximale Anzahl an Flügen
      function getMaxOfArray(numArray) {
        return Math.max.apply(null, numArray);
      }

      //Map zeichnen
      function updateVisualization(rows) {
        var data = [];
        var count = unpack(rows, "AIRLINE");
        var startLongitude = unpack(rows, "ORIGIN_AIRPORT_LON");
        var endLongitude = unpack(rows, "DESTINATION_AIRPORT_LON");
        var startLat = unpack(rows, "ORIGIN_AIRPORT_LAT");
        var endLat = unpack(rows, "DESTINATION_AIRPORT_LAT");

        //Opacity je nach Anzahl der Flüge
        for (var i = 0; i < count.length; i++) {
          var opacityValue = count[i] / getMaxOfArray(count);

          //Daten für die Map setzen
          var result = {
            type: "scattergeo",
            locationmode: "USA-states",
            lon: [startLongitude[i], endLongitude[i]],
            lat: [startLat[i], endLat[i]],
            mode: "lines+markers",
            line: {
              width: 0.5,
              color: "red",
            },
            opacity: opacityValue,
            hoverinfo: "lon,lat,text",
            text:
              [rows[i]["ORIGIN_AIRPORT"]] +
              " - " +
              [rows[i]["DESTINATION_AIRPORT"]],
          };
          data.push(result);
        }
        //Chart zeichnen
        Plotly.newPlot("chart5", data, layout, { showLink: false });
      }

      //Layout für die Map setzen
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
