//Dropdown Menü für das Dashboard
document.addEventListener("DOMContentLoaded", function () {
  const selectElement = document.getElementById("form-field2_1");
  selectElement.addEventListener("change", () => {
    const selectedOption = selectElement.value;
    if (selectedOption === "Flugdaten") {
      window.location.href = "../index.html";
    } else if (selectedOption === "Wetterdaten") {
      window.location.href = "./pages/flug_wetterdaten.html";
    }
  });
});
