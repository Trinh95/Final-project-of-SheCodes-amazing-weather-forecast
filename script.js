function showTime(time) {
  let hour = time.getHours();
  let minute = time.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }

  if (hour > 6 && hour < 12) {
    document.body.style.backgroundImage = "url('img/morning.jpg')";
  }
  if (hour > 18) {
    document.body.style.backgroundImage = "url('img/night.jpg')";
  }

  if (hour < 10) {
    hour = `0${hour}`;
  }
  let days = [
    `Sunday`,
    `Monday`,
    `Tuesday`,
    `Wednesday`,
    `Thursday`,
    `Friday`,
    `Saturday`,
  ];
  let day = days[time.getDay()];
  let h5 = document.querySelector("h5");
  h5.innerHTL = `${day}, ${hour}:${minute}`;
}
function upperFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function editday(timestamp) {
  let date = new Date(timestamp);
  let days = [`Sun`, `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`];
  day = days[date.getDay()];
  return day;
}

function showForecast(answer) {
  let days = answer.data.daily;
  console.log(days);
  let eachDayElement = document.querySelector("#forecast");
  let eachDayHTML = `<div class="row">`;
  days.forEach(function (day, index) {
    if (index < 6) {
      eachDayHTML =
        eachDayHTML +
        `<div class="col-sm">
              <div><strong>${editday(day.dt * 1000)}</strong></div>
              <img
                class="icon-weather"
                src="https://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png"/>
              <br />
              <span class="max-temperature">${Math.round(
                day.temp.max
              )}°</span> / 
              <span class="min-temperature">${Math.round(day.temp.min)}°</span>
            </div>
            `;
    }
  });
  eachDayHTML = eachDayHTML + `</div>`;
  eachDayElement.innerHTML = eachDayHTML;
}

function gotoForecast(result) {
  let forecastLink = `https://api.openweathermap.org/data/2.5/onecall?lat=${result.lat}&lon=${result.lon}&units=metric&&appid=${apiKey}`;
  console.log(forecastLink);
  axios.get(forecastLink).then(showForecast);
}

function showweather(response) {
  console.log(response);
  let feelslike = document.querySelector("#feelslike");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  let temperature = document.querySelector("#temperature");
  let cityNameElement = document.querySelector("#cityName");
  let mainIcon = document.querySelector("#mainIcon");
  let linkIcon = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
  let description = document.querySelector("#description");

  Ctemperature = response.data.main.temp;

  feelslike.innerHTML = Math.round(response.data.main.feels_like);
  humidity.innerHTML = Math.round(response.data.main.humidity);
  wind.innerHTML = Math.round(response.data.wind.speed);
  temperature.innerHTML = Math.round(response.data.main.temp);
  cityNameElement.innerHTML = response.data.name.toUpperCase();
  description.innerHTML = upperFirstLetter(
    response.data.weather[0].description
  );
  mainIcon.setAttribute("alt", response.data.weather[0].description);
  mainIcon.setAttribute("src", linkIcon);
  showTime(new Date(response.data.dt * 1000));
  gotoForecast(response.data.coord);
}

function queryLink(cityInput) {
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=metric&appid=${apiKey}`;
  axios.get(weatherUrl).then(showweather);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#cityInput").value;
  queryLink(cityInput);
}

function showFtemperature(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temperature");
  temperature.innerHTML = Math.round((Ctemperature * 9) / 5 + 32);
  Ctemplink.classList.remove("inactive");
  Ftemplink.classList.add("inactive");
}

function showCtemperature(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temperature");
  temperature.innerHTML = Math.round(Ctemperature);
  Ftemplink.classList.remove("inactive");
  Ctemplink.classList.add("inactive");
}

function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "c3b8d523aae85de22d68b39520fd6094";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showweather);
}

function searchCity() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let apiKey = "c3b8d523aae85de22d68b39520fd6094";

let Ctemperature = null;

let searchBox = document.querySelector("#searchBox");
searchBox.addEventListener("submit", handleSubmit);

let Ftemplink = document.querySelector("#Ftemp");
Ftemplink.addEventListener("click", showFtemperature);

let Ctemplink = document.querySelector("#Ctemp");
Ctemplink.addEventListener("click", showCtemperature);

let positionButton = document.querySelector("#locationButton");
positionButton.addEventListener("click", searchCity);

queryLink("Krakow");
