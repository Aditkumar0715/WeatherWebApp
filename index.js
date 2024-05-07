function show(e) {
  e.classList.add('active');
}
function hide(e) {
  e.classList.remove('active');
}

const permit = document.querySelector('.grant-permission-container');
const searchTab = document.querySelector('.search-container');
const loader = document.querySelector('.loader-container');
const weatherDetails = document.querySelector('.weather-details-container');
const grantbtn = document.querySelector('.grant-access-btn');
const yourWeatherTab = document.querySelector('.your-weather-tab');
const searchWeatherTab = document.querySelector('.search-weather-tab');
const userInput = document.querySelector('.search-input');
let currentTab = yourWeatherTab;
currentTab.classList.add('current-tab');
const apiKey = "d1845658f92b31c64bd94f06f7188c9c";
checkSessionStorage();

// let lat=null;
// let lon=null;
yourWeatherTab.addEventListener('click', () => {
  switchTabs(yourWeatherTab);
})
searchWeatherTab.addEventListener('click', () => {
  switchTabs(searchWeatherTab);
})

function switchTabs(clickedTab){
  if (clickedTab != currentTab) {
    currentTab.classList.remove('current-tab');
    currentTab = clickedTab;
    currentTab.classList.add('current-tab');
    if (!searchTab.classList.contains('active')) {
      hide(permit);
      hide(weatherDetails);
      userInput.value= ""
      show(searchTab);
    }
    else {
      hide(searchTab);
      hide(weatherDetails);
      checkSessionStorage();
    }
  }
}

async function fetchUserWeather(coords) {
  // const { lat, lon } = coords;
  const lat = coords.lat;
  const lon = coords.lon;
  // making the loader visible and hide grant access container
  hide(permit);
  console.log('line no 55')
  show(loader);
  // calling weather api using coordinates in try-catch block
  try {
    const apiresponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const data = await apiresponse.json();
    renderInfo(data);
    hide(loader);
    show(weatherDetails);
    // console.log(data);
  }
  catch (error) {
    console.error('the error message occured is : ' + error)
  }
}

async function fetchSearchWeather(name) {
  // console.log('line no 72')
  show(loader);
  try {
    const apiresponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${apiKey}`);
    const data = await apiresponse.json();
    renderInfo(data);
    hide(loader);
    show(weatherDetails);
    // console.log(data);

  }
  catch (error) {

  }
}
const searchInp = document.querySelector('.search-input');
const searchForm = document.querySelector('.search-form');
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (userInput.value != "") {
    fetchSearchWeather(userInput.value);
  }
  else {
    hide(weatherDetails);
    alert('Please provide some city name');
  }
})

// function to render the information on the ui

function renderInfo(info) {
  const cityName = document.querySelector('.city-name');
  const countryIcon = document.querySelector('.flag');
  const weatherDesc = document.querySelector('.weather-description');
  const weatherIcon = document.querySelector('.weather-icon');
  const temperature = document.querySelector('.temperature');
  const windSpeed = document.querySelector('.windspeed-data');
  const humidity = document.querySelector('.humidity-data');
  const clouds = document.querySelector('.cloudiness-data');

  // get values from the response of the api and put the values on ui elements

  cityName.innerText = info?.name;
  countryIcon.src = `https://flagcdn.com/56x42/${info?.sys?.country.toLowerCase()}.png`
  weatherDesc.innerText = info?.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${info?.weather?.[0]?.icon}.png`

  //TODO yaha deg C append krna h last me
  temperature.innerText = info?.main?.temp + " K";
  windSpeed.innerText = info?.wind?.speed + " m/s";
  humidity.innerText = info?.main?.humidity + "%";
  clouds.innerText = info?.clouds?.all + "%";

}

function checkSessionStorage() {
  const localCoords = sessionStorage.getItem('user-coords');

  if (!localCoords) {
    show(permit);
  }
  else {

    const coords = JSON.parse(localCoords);
    fetchUserWeather(coords);
  }



  // if (sessionStorage.getItem('lat')==null || sessionStorage.getItem('lon')==null) {
  //   hide(weatherDetails);
  //   show(permit);
  // }
  // else {
  //   lat = sessionStorage.getItem('lat');
  //   lon = sessionStorage.getItem('lon');
  //   // try to get both values in one line of code may be if is possible :)
  //   apiresponse = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
  //   hide(permit);
  //   apiJson = JSON.parse(apiresponse);
  //   console.log(apiJson);
  //   //loader show krna h
  //   //api se value set krni h weather ki
  //   show(weatherDetails);
  // }
}



grantbtn.addEventListener('click', () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(success, someError);
  }
})
let success = (position) => {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  const userCoords = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem('user-coords',JSON.stringify(userCoords));
  fetchUserWeather(userCoords)
  // console.log(lat, lon, "got the coordinates hell yeah :o");
}

const someError = (error) => {
  console.error('error occured : ', error.message);
  alert('Weather Can not be displayed you denied location access');
}
