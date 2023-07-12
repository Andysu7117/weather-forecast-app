const apiKey = "f313c94bb5948f7ff58103c85bfce8ce";
const searchFormEl = document.querySelector("#search-form");
const resultsEl = document.querySelector("#today-forecast");
const fiveDayEl = document.querySelector("#five-day-forecast");

function printResults(resultObj) {
  var header = $("h3");
  header.innerHTML = resultObj.city.name + resultObj.weather.icon;

  var temp = $("p");
  temp.text("Temperature: " + resultObj.list.temp);

  var wind = $("p");
  wind.text("Wind: ");

  var humidity = $("p");
  humidity.text("Humidity: ");

  resultsEl.append(header, temp, wind, humidity);

  resultObj.forEach((day) => {
    var cardEl = $('<div class="card"></div>');
  });
}

function getWeatherForecast(latitude, longitude) {
  const locQueryUrl = "api.openweathermap.org/data/2.5/forecast?";
  const queryUrl = locQueryUrl + latitude + longitude + "appid=" + apiKey;

  fetch(queryUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((weatherRes) => {
      printResults(weatherRes);
    });
}

function getCoordinates(query) {
  const locQueryUrl = "http://api.openweathermap.org/geo/1.0/direct?q=";

  const queryUrl = locQueryUrl + query + "&limit=1&appid=" + apiKey;

  fetch(queryUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((coordRes) => {
      const name = coordRes[0][0];
      const latitude = coordRes[1];
      const longitude = coordRes[2];
      getWeatherForecast(name, latitude, longitude);
    });
}

function handleSearchFormSubmit(event) {
  event.preventDefault();
  const searchInputVal = document.querySelector("#search-input").val();

  if (!searchInputVal) {
    $("#no-input").modal("show");
  }

  const query = searchInputVal.replace(" ", "+");

  getCoordinates(query);
}

searchFormEl.addEventListener("submit", handleSearchFormSubmit);
