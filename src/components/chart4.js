document.addEventListener('DOMContentLoaded', function () {
  //TREEMAP ORIGIN & DESTINATION
  d3.csv(
    "https://gist.githubusercontent.com/xdavld/7e5231fa7930ac28a0db4d26c92eac01/raw/b9b31896669f498776f04bb907ba2571da05a96f/treemap_origin_stats.csv",
    function (err1, firstData) {
      d3.csv(
        "https://gist.githubusercontent.com/xdavld/41aba9c8c37f8eccd9ac2ae233b375aa/raw/bee0320c728a09398113aeb7e531d1bc33dc0cb6/treemap_destination_stats.csv",
        function (err2, secondData) {
          // Einlesen von zwei CSV-Dateien / Treemap Origin und Treemap Destination
          function unpack(rows, key) {
            return rows.map(function (row) {
              return row[key];
            });
          }

          //Daten aus eingelesenen Daten einsetzen
          var data = [
            {
              type: "treemap",
              labels: unpack(firstData, "ORIGIN_AIRPORT"),
              parents: unpack(firstData, "parents_origin"),
              values: unpack(firstData, "FLIGHT_COUNT"),
              textinfo: "label+value",
              domain: { x: [0, 0.48] },
              outsidetextfont: { size: 20, color: "#377eb8" },
              marker: { line: { width: 2 } },
              pathbar: { visible: false },
            },
            {
              type: "treemap",
              labels: unpack(secondData, "DESTINATION_AIRPORT"),
              parents: unpack(secondData, "parents_destination"),
              values: unpack(secondData, "FLIGHT_COUNT_DESTINATION"),
              domain: { x: [0.52, 1] },
              textinfo: "label+value",
              outsidetextfont: { size: 20, color: "#377eb8" },
            },
          ];

          //Layout für die Treemap
          var layout = {
            plot_bgcolor: "rgba(0,0,0,0)",
            paper_bgcolor: "rgba(0,0,0,0)",
            margin: {
              l: 0,
              r: 0,
              b: 0,
              t: 0,
            },
            height: 800,
            treemap: {
              tiling: "squarify",
              pad: 0,
            },
          };

          //Plot zeichnen
          Plotly.newPlot(
            "chart4",
            data,
            layout,
            { responsive: true },
            { displayModeBar: false }
          );
        }
      );
    }
  );
});
