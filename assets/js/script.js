
console.log("JS loaded")
var apiKey = "24a91c7139dc950ad59b35f668ee88c8"
var historyList = [];
var today = moment().format('L');
var searchBtn = document.getElementById("search-btn")

//CURRENT WEATHER URL
var getCityWeather = function (city) {

  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units-metric`;

  // make a get request to url
  fetch(apiUrl)
    .then(function (response) {
      return response.json()
    })
    .then(function (cityResponse) {
      console.log(cityResponse);
      var lat = cityResponse.coord.lat
      var lon = cityResponse.coord.lon
      cityCoord(lat, lon, city)
    })
}

function cityCoord(lat, lon, city) {

  // WEATHER SECTION CURRENT & FIVE DAY
  var fivedayURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`;

  fetch(fivedayURL)
    .then(function (response) {
      return response.json()
    })
    .then(function (fivedayCoord) {
      console.log(fivedayCoord);

      $("#weather-section").css("display", "block")
      $("#weather-card").empty()

      var iconCode = fivedayCoord.current.weather[0].icon
      var iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
      let HTMLCode = `
      <h2>${city} ${today} <img src="${iconURL}" alt="${fivedayCoord.current.weather[0].description}"/></h2>
      <div id="city-weather">
        <p>Temperature: ${fivedayCoord.current.temp} °C</p>
        <p>Humidity: ${fivedayCoord.current.humidity}\%</p>
        <p>Wind Speed: ${fivedayCoord.current.wind_speed} MPH</p>
        <p>UV Index: <span id="uvColor">${fivedayCoord.current.uvi}</span></p>
      </div>`;

      let uvIndex = fivedayCoord.current.uvi

      $("#weather-card").html(HTMLCode)

      if (uvIndex >= 0 && uvIndex <= 2) {
        $("#uvColor").css("background-color", "#239B56").css("color", "white");
      } else if (uvIndex >= 3 && uvIndex <= 4) {
        $("#uvColor").css("background-color", "#FFC300");
      } else if (uvIndex >= 5 && uvIndex <= 6) {
        $("#uvIColor").css("background-color", "#FF5733");
      } else if (uvIndex >= 7 && uvIndex <= 9) {
        $("#uvColor").css("background-color", "#C70039").css("color", "white");
      } else {
        $("#uvColor").css("background-color", "#5B2C6F").css("color", "white");
      };
      // $("#five-day").empty();

      let fivedayHTMLCode = ""
      for (let i = 0; i < 5; i++) {
        var fivedayInfo = {
          date: fivedayCoord.daily[i].dt,
          description: fivedayCoord.daily[i].weather[0].description,
          icon: fivedayCoord.daily[i].weather[0].icon,
          tempmin: fivedayCoord.daily[i].temp.min,
          tempmax: fivedayCoord.daily[i].temp.max,
          wind: fivedayCoord.daily[i].wind_speed,
          humidity: fivedayCoord.daily[i].humidity
        };

        var currDate = moment.unix(fivedayInfo.date).format("MM/DD/YYYY");
        var fivedayIconURL = `<img src="https://openweathermap.org/img/wn/${fivedayInfo.icon}@2x.png" alt="${fivedayInfo.description}"/>`;

    
        fivedayHTMLCode += `
            <div class="card mr-3 mb-2 text-light" style="width: 12rem":>
              <div class="card-fiveday">
                <h5>${currDate}</h5>
                <p>${fivedayIconURL}</p>
                <p>Temp Low: ${fivedayInfo.tempmin} °C</p>
                <p>Temp High: ${fivedayInfo.tempmax} °C</p>
                <p>Wind: ${fivedayInfo.wind} MPH</p>
                <p>Humidity: ${fivedayInfo.humidity}\%</p>
              </div>  
            </div>`
      }
      $("#five-day").html(fivedayHTMLCode);
      $("#city-history").empty();
    });
}

// SEARCH CITY
searchBtn.addEventListener("click", function (event) {
  event.preventDefault()
  let city = document.getElementById("city-name").value
  console.log(city)
  getCityWeather(city)

// SAVE & VIEW CITY IN LIST
  if (!historyList.includes(city)) {
    historyList.push(city);
    var searchedCity = $(`<li class="city-history">${city}</li>`);
    $("#search-list").append(searchedCity);
  };

  localStorage.setItem("city", JSON.stringify(historyList));
  console.log(historyList);
});


$(document).on("click", ".city-history", function () {
  var listCity = $(this).text();
  getCityWeather(listCity);
});


$(document).ready(function () {
  var historyArr = JSON.parse(localStorage.getItem("city"));

  if (historyArr !== null) {
    var lastSearchedIndex = historyArr.length - 1;
    var lastSearchedCity = historyArr[lastSearchedIndex];
    getCityWeather(lastSearchedCity);
    console.log(`Last city searched: ${lastSearchedCity}`);
    $("#search-list").html("")
    for (let i=0; i<historyArr.length; i++) {
      var searchedCity = $(`<li class="city-history">${historyArr[i]}</li>`);
    $("#search-list").append(searchedCity);
    }
  }
});

