//An folgender Dokumentation orientiert: https://plotly.com/javascript/bar-charts/

document.addEventListener("DOMContentLoaded", function () {
  //Barchart
  // CSV-Daten - hardgecoded
  var csvData = `AIRLINE,FLIGHT_NUMBER,DISTANCE
                VX,61248,86015315
                HA,76041,48059967
                F9,90090,87131086
                NK,115193,113554532
                AS,171439,205501421
                US,194223,177787900
                B6,262042,278563818
                MQ,278791,117834199
                UA,507762,645712785
                EV,554752,256130025
                OO,576814,287096076
                AA,712935,743143898
                DL,870275,742864113
                WN,1242403,921558206`;

  // CSV-Daten einlesen
  var results = Papa.parse(csvData, { header: true });
  var rows = results.data;

  // Daten für die Barcharts
  var airlines = [];
  var flightNumber = [];
  var distances = [];
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    airlines.push(row.AIRLINE);
    flightNumber.push(row.FLIGHT_NUMBER);
    distances.push(row.DISTANCE / 1000);
  }

  // Daten für den Barchart - erster Balken setzen
  var trace1 = {
    x: flightNumber,
    y: airlines,
    name: "Flüge",
    type: "bar",
    orientation: "h",
    marker: {
      color: "rgb(99, 102, 241)",
      opacity: 0.9,
    },
  };

  // Daten für den Barchart - zweiten Balken setzen
  var trace2 = {
    x: distances,
    y: airlines,
    name: "Distanz",
    type: "bar",
    orientation: "h",
  };

  // Daten für den Barchart - Array mit den Daten
  var data = [trace1, trace2];

  // Layout für den Barchart
  var layout = {
    plot_bgcolor: "rgba(0,0,0,0)",
    paper_bgcolor: "rgba(0,0,0,0)",
    margin: {
      l: 25,
      r: 0,
      b: 35,
      t: 0,
    },
    xaxis: {
      tickangle: -45,
    },
  };

  // Barchart zeichnen
  Plotly.newPlot("chart2", data, layout, { displayModeBar: false });
});
