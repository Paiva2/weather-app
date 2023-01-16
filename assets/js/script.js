const apiKey = "2b5ab987deb1da7bbe2f8b36bb256a1c";
const cityName = document.querySelector(".city-input");
const btnSend = document.querySelector("#search-button");
const form = document.querySelector("#form");
const cardInfo = document.querySelector(".img-div");
const showTempInfo = document.getElementById("temperature-info");
const textLocalDiv = document.getElementById("local-div");
const refreshBtn = document.querySelector(".refresh-btn");
const refreshIcon = document.getElementById("iIcon");
const iconRotate = "fas fa-sync fa-spin";
const iconStop = "fa-solid fa-rotate";
let defaultValue = `https://api.openweathermap.org/data/2.5/weather?q=New%20york&units=metric&appid=${apiKey}`;
let condition = true;

const weatherAPI = async function (url) {
  const response = await fetch(url);
  if (refreshIcon.classList.contains("fa-sync")) {
    refreshIcon.className = iconStop;
  }
  if (!response.ok) {
    form.reset();
    throw new Error("Invalid city name");
  } else {
    return response.json();
  }
};
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "May",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const dates = () => {
  var today = new Date();
  var dayName = days[today.getDay()];
  var month = months[today.getMonth()];
  var dayNumber = today.getDate();
  return { dayName: dayName, month: month, dayNumber: dayNumber }
};

const getData = () => {
  btnSend.addEventListener("click", (e) => {
    e.preventDefault();
    if (cityName.value === "") {
      Swal.fire("Invalid City name!", "", "error");
    } else refreshIcon.className = iconRotate;
    defaultValue = `https://api.openweathermap.org/data/2.5/weather?q=${cityName.value}&units=metric&appid=${apiKey}&`;
    defaultResult();
  });
};
const defaultResult = () => {
  weatherAPI(defaultValue).then((resultJson) => {
    const dataResult = [
      resultJson.main.temp.toFixed(0),
      resultJson.name,
      resultJson.weather[0].icon,
      resultJson.weather[0].main,
      resultJson.sys.country,
    ];
    if (condition === true) {
      createElements(dataResult);
      condition = false;
    }
    if (condition === false) {
      reset();
      condition = true;
      createElements(dataResult);
    }
  });
};
defaultResult();
getData();

const refreshResult = () => {
  refreshBtn.addEventListener("click", (e) => {
    const el = e.target;
    if (el.classList.contains("fa-solid")) {
      refreshIcon.className = iconRotate;
      defaultResult();
    }
  });
};
refreshResult();

const reset = () => {
  cardInfo.innerHTML = "";
  textLocalDiv.innerHTML = "";
  showTempInfo.innerHTML = "";
  form.reset();
};

const createElements = (dataResult) => {
  const [temperature, cityName, weatherIcon, weatherStatus, contryAbreviation] = dataResult;
  const {dayName, month, dayNumber} = dates();
  const img = document.createElement("img");
  const h1 = document.createElement("h1");
  const h2 = document.createElement("h2");
  const pWeatherInfo1 = document.createElement("p");
  const pWeatherInfo2 = document.createElement("p");

  pWeatherInfo1.className = "p1";
  pWeatherInfo2.className = "p2";

  cardInfo.appendChild(img);
  showTempInfo.appendChild(h1);
  showTempInfo.appendChild(pWeatherInfo1);
  showTempInfo.appendChild(pWeatherInfo2);
  textLocalDiv.appendChild(h2);

  h2.innerText = `${cityName}, ${contryAbreviation}`;
  img.src = `/assets/img/icons/${weatherIcon}.svg`;
  h1.innerText = `${temperature}º`;
  pWeatherInfo1.innerText = weatherStatus;
  pWeatherInfo2.innerText = `${dayName}, ${month} ${dayNumber}`;
};
