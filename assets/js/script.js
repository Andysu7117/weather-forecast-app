const apiKey = "9d4617c693699ddd5b2eae0bab5fad04";
const searchFormEl = document.querySelector("#search-form");
const resultsEl = document.querySelector("#today-forecast");
const fiveDayEl = document.querySelector("#five-day-forecast");
const searchHistoryEl = document.querySelector("#search-history");
const clearHistoryBtn = document.querySelector("#clear-history");

// Date object referenced from https://www.scaler.com/topics/get-current-date-in-javascript/
const date = new Date();
let currentDay = String(date.getDate()).padStart(2, "0");
let currentMonth = String(date.getMonth() + 1).padStart(2, "0");
let currentYear = date.getFullYear();
// we will display the date as DD-MM-YYYY
let currentDate = `${currentYear}-${currentMonth}-${currentDay}`;

function printResults(weatherData) {
  // Clear previous results
  resultsEl.innerHTML = "";
  fiveDayEl.innerHTML = "";

  // Display current weather conditions
  const cityName = weatherData.city.name;
  const currentTemperature = weatherData.list[0].main.temp;
  const currentHumidity = weatherData.list[0].main.humidity;
  const currentWindSpeed = weatherData.list[0].wind.speed;
  const currentIcon = weatherData.list[0].weather[0].icon;
  const iconElement = document.createElement("img");
  iconElement.src = "https://openweathermap.org/img/w/" + currentIcon + ".png";

  const header = document.createElement("h3");
  header.innerHTML = cityName;
  header.append(iconElement);

  const temperature = document.createElement("p");
  temperature.textContent = "Temperature: " + currentTemperature + "°C";

  const humidity = document.createElement("p");
  humidity.textContent = "Humidity: " + currentHumidity + "%";

  const windSpeed = document.createElement("p");
  windSpeed.textContent = "Wind Speed: " + currentWindSpeed + "KMH";

  resultsEl.appendChild(header);
  resultsEl.appendChild(temperature);
  resultsEl.appendChild(humidity);
  resultsEl.appendChild(windSpeed);

  // Display 5-day forecast
  const forecast = weatherData.list;
  const daysToShow = 5;
  const forecastLength = forecast.length;

  forecast.forEach(function (list) {
    if (
      list.dt_txt.includes("12:00:00") &&
      !list.dt_txt.includes(currentDate)
    ) {
      const onlyDate = list.dt_txt.split(" ");
      const date = onlyDate[0];
      const icon = list.weather[0].icon;
      const temperature = list.main.temp;
      const humidity = list.main.humidity;
      const windSpeed = list.wind.speed;

      const card = document.createElement("div");
      card.className = "card";

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      const cardTitle = document.createElement("h5");
      cardTitle.className = "card-title";
      cardTitle.textContent = date;

      const iconElement = document.createElement("img");
      iconElement.src = "https://openweathermap.org/img/w/" + icon + ".png";

      const tempElement = document.createElement("p");
      tempElement.className = "card-text";
      tempElement.textContent = "Temperature: " + temperature + "°C";

      const windElement = document.createElement("p");
      windElement.className = "card-text";
      windElement.textContent = "Wind Speed: " + windSpeed + "KMH";

      const humidityElement = document.createElement("p");
      humidityElement.className = "card-text";
      humidityElement.textContent = "Humidity: " + humidity + "%";

      cardBody.appendChild(cardTitle);
      cardBody.appendChild(iconElement);
      cardBody.appendChild(tempElement);
      cardBody.appendChild(windElement);
      cardBody.appendChild(humidityElement);

      card.appendChild(cardBody);
      fiveDayEl.appendChild(card);
    } else {
      return;
    }
  });

  if (fiveDayEl.children.length < daysToShow && forecastLength > 0) {
    const onlyDate = weatherData.list[39].dt_txt.split(" ");
    const date = onlyDate[0];
    const icon = weatherData.list[39].weather[0].icon;
    const temperature = weatherData.list[39].main.temp;
    const humidity = weatherData.list[39].main.humidity;
    const windSpeed = weatherData.list[39].wind.speed;

    const card = document.createElement("div");
    card.className = "card";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const cardTitle = document.createElement("h5");
    cardTitle.className = "card-title";
    cardTitle.textContent = date;

    const iconElement = document.createElement("img");
    iconElement.src = "https://openweathermap.org/img/w/" + icon + ".png";

    const tempElement = document.createElement("p");
    tempElement.className = "card-text";
    tempElement.textContent = "Temperature: " + temperature + "°C";

    const windElement = document.createElement("p");
    windElement.className = "card-text";
    windElement.textContent = "Wind Speed: " + windSpeed + "KMH";

    const humidityElement = document.createElement("p");
    humidityElement.className = "card-text";
    humidityElement.textContent = "Humidity: " + humidity + "%";

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(iconElement);
    cardBody.appendChild(tempElement);
    cardBody.appendChild(windElement);
    cardBody.appendChild(humidityElement);

    card.appendChild(cardBody);
    fiveDayEl.appendChild(card);
  }
}

function getWeatherForecast(latitude, longitude) {
  const locQueryUrl = "https://api.openweathermap.org/data/2.5/forecast?";
  const queryUrl =
    locQueryUrl +
    "lat=" +
    latitude +
    "&" +
    "lon=" +
    longitude +
    "&appid=" +
    apiKey +
    "&units=metric";

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
      if (!coordRes.length) {
        $("#no-results").modal("show");
        resultsEl.innerHTML = "";
        fiveDayEl.innerHTML = "";
      } else {
        const latitude = coordRes[0].lat;
        const longitude = coordRes[0].lon;
        getWeatherForecast(latitude, longitude);
      }
    });
}

function saveSearchHistory(cityName) {
  let searchHistory = localStorage.getItem("searchHistory");
  if (!searchHistory) {
    searchHistory = [];
  } else {
    searchHistory = JSON.parse(searchHistory);
  }

  searchHistory.push(cityName);

  // Add the new city name to the search history

  // Save the updated search history to localStorage
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

function addToSearchHistory(cityName) {
  let searchHistory = localStorage.getItem("searchHistory");
  if (!searchHistory) {
    searchHistory = [];
  } else {
    searchHistory = JSON.parse(searchHistory);
  }

  if (searchHistory.includes(cityName)) {
    return;
  }
  const btnDiv = document.createElement("div");
  btnDiv.className = "d-grid gap-2";
  const searchHistoryItem = document.createElement("button");
  searchHistoryItem.className = "btn btn-secondary";
  searchHistoryItem.textContent = cityName;
  searchHistoryItem.textContent = cityName;

  btnDiv.appendChild(searchHistoryItem);
  searchHistoryEl.appendChild(btnDiv);

  saveSearchHistory(cityName);
}

function addFromLocalStorage(cityName) {
  const btnDiv = document.createElement("div");
  btnDiv.className = "d-grid gap-2";
  const searchHistoryItem = document.createElement("button");
  searchHistoryItem.className = "btn btn-secondary";
  searchHistoryItem.textContent = cityName;
  searchHistoryItem.textContent = cityName;

  btnDiv.appendChild(searchHistoryItem);
  searchHistoryEl.appendChild(btnDiv);
}

function loadSearchHistory() {
  let searchHistory = localStorage.getItem("searchHistory");
  if (searchHistory) {
    searchHistory = JSON.parse(searchHistory);
    searchHistory.forEach((cityName) => {
      addFromLocalStorage(cityName);
    });
  }
}

function clearSearchHistory() {
  localStorage.removeItem("searchHistory");
  searchHistoryEl.innerHTML = "";
}

function handleSearchFormSubmit(event) {
  event.preventDefault();
  const searchInputVal = document.querySelector("#search-input").value;

  if (!searchInputVal) {
    $("#no-input").modal("show");
    return;
  }

  const query = searchInputVal.replace(" ", "+");

  getCoordinates(query);
  addToSearchHistory(searchInputVal);
}

function handleCityClick(event) {
  event.preventDefault();
  const cityName = event.target.textContent;
  const query = cityName.replace(" ", "+");
  getCoordinates(query);
}

clearHistoryBtn.addEventListener("click", clearSearchHistory);
searchFormEl.addEventListener("submit", handleSearchFormSubmit);
searchHistoryEl.addEventListener("click", handleCityClick);

$(document).ready(loadSearchHistory);
