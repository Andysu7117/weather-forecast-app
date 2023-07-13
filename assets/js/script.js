const apiKey = "9d4617c693699ddd5b2eae0bab5fad04";
const searchFormEl = document.querySelector("#search-form");
const resultsEl = document.querySelector("#today-forecast");
const fiveDayEl = document.querySelector("#five-day-forecast");
var now = dayjs();
var currentDate = dayjs(now, "YYYY-MM-DD");
console.log(now);

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

  for (let i = 0; i < resultObj.list.length; i + 7) {
    const element = array[i];
  }

  resultObj.forEach(function (list) {
    var colEl = $('<div class="col"></div>');
    var cardEl = $('<div class="card"></div>');
    var bodyEl = $('<div class="card-body"></div>');
    var titleEl = $('<h5 class=""card-title></h5>');
    var icon = $("<p>" + resultObj.list.weather.icon + "</p>");
    var temp = $('<p class="card-text"></p>');
    var wind = $('<p class="card-text"></p>');
    var humidity = $('<p class="card-text"></p>');
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
  const locQueryUrl = "https://api.openweathermap.org/geo/1.0/direct?q=";

  const queryUrl = locQueryUrl + query + "&limit=1&appid=" + apiKey;

  fetch(queryUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((coordRes) => {
      const latitude = coordRes[0].lat;
      const longitude = coordRes[0].lon;
      getWeatherForecast(latitude, longitude);
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

let latitude = 44.34;
let longitude = 10.99;

const locQueryUrl = "https://api.openweathermap.org/data/2.5/forecast?";
const queryUrl =
  locQueryUrl +
  "lat=" +
  latitude +
  "&" +
  "lon=" +
  longitude +
  "&cnt=41" +
  "&appid=" +
  apiKey;
fetch(queryUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((weatherRes) => {
    console.log(weatherRes);
    // printResults(weatherRes);
  });

// const locQueryUrl = "https://api.openweathermap.org/geo/1.0/direct?q=";
// let query = "sydney";
// const queryUrl = locQueryUrl + query + "&limit=1&appid=" + apiKey;

// fetch(queryUrl)
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.json();
//   })
//   .then((coordRes) => {
//     console.log(coordRes);
//     console.log(coordRes[0].lon);
//     console.log(coordRes[0].lat);
//     // const name = coordRes[0][0];
//     // const latitude = coordRes[1];
//     // const longitude = coordRes[2];
//     // getWeatherForecast(name, latitude, longitude);
//   });
