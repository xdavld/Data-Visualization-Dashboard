//An folgender Dokumentation orientiert: https://plotly.com/javascript/box-plots/

document.addEventListener("DOMContentLoaded", function () {
  //BOXPLOT
  d3.csv("https://gist.githubusercontent.com/xdavld/fcf471b05e97587489285d9d86aba72c/raw/db159232908e43b34c3e90fbbf049ecd52be057f/arrival_delay_boxplot.csv", function(data) {
    //Nur positive Werte
    var filteredData = data.filter(function (d) {
      return d.ARRIVAL_DELAY > 0;
    });

    //Daten gruppieren der Flüge pro Airline
    var groupedData = filteredData.reduce(function (acc, d) {
      if (!acc[d.AIRLINE]) {
        acc[d.AIRLINE] = [];
      }
      acc[d.AIRLINE].push(d.ARRIVAL_DELAY);
      return acc;
    }, {});

    //Boxplot erstellen aus gruppierten Daten
    var traces = Object.keys(groupedData).map(function (airline) {
      return {
        y: airline,
        x: groupedData[airline],
        type: "box",
        name: airline,
      };
    });

    // Layout anpassen
    var layout = {
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
      margin: {
        l: 25,
        r: 10,
        b: 35,
        t: 0,
      },
      xaxis: {
        range: [0, 100],
      }
    };

    // Plot zeichnen
    Plotly.newPlot("chart3", traces, layout, { displayModeBar: false });
  });

});
