const skeletonLoader = document.getElementById("skeletonLoader");

const searchLocation = document.getElementById("searchLocation"),
 toggle = document.getElementById("toggle"),
 weatherIcon = document.querySelector(".weatherIcon"),
 temperature = document.querySelector(".temperature"),
 whatfeels = document.querySelector(".whatfeels"),
 description = document.querySelector(".description"),
 date = document.querySelector(".date"),
 city = document.querySelector(".city"),

 humValue = document.getElementById("humValue"),
 windValue= document.getElementById("windValue"),
 sunRValue = document.getElementById("sunRValue"),
 sunSValue = document.getElementById("sunSValue"),
 cloudValue = document.getElementById("cloudValue"),
 uvValue = document.getElementById("uvValue"),
 preValue = document.getElementById("preValue"),

 forecast = document.querySelector(".forecast");

 var WEATHER_API=`https://api.openweathermap.org/data/2.5/weather?appid=0c93b9a1e09d8a89b33a9a635bb87add&q=`;
 var WEATHER_DATA=`https://api.openweathermap.org/data/3.0/onecall?appid=0c93b9a1e09d8a89b33a9a635bb87add&exclude=minutely&units=metric&`;

// async function findLocation(){
//     let location = "London";
//     const res = await fetch(`${WEATHER_API}${location}`);
//     data = await res.json();
//     console.log(data);
//     updateData();

// }
const favoriteButton = document.getElementById("favorite");
const showFav = document.getElementById("show-fav");
const favoritesList = document.getElementById("favorites-list");
const favCities = document.getElementById("fav-cities");
favoriteButton.addEventListener("click", addtoFavorite);
showFav.addEventListener("click", showFavorites);
async function findLocation() {
    forecast.innerHTML = "";
    skeletonLoader.classList.remove('d-none');
    const weatherDetail = document.querySelector(".bodyContent");
    weatherDetail.classList.add('d-none');
    try {
        // Fetch location data
        const locationResponse = await fetch(WEATHER_API + searchLocation.value);
        const locationData = await locationResponse.json();
        
        if (locationData.cod !== "" && locationData.cod !== 200) {
            alert(locationData.message);
            skeletonLoader.classList.add('d-none');
            return;
        }
        
        // console.log(locationData);
        city.innerHTML = locationData.name + " , " + locationData.sys.country;
        // weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${locationData.weather[0].icon}@2x.png)`;
        weatherIcon.src = `https://openweathermap.org/img/wn/${locationData.weather[0].icon}@2x.png`;
        
        // Fetch weather data
        const weatherResponse = await fetch(WEATHER_DATA + `lon=${locationData.coord.lon}&lat=${locationData.coord.lat}`);
        const weatherData = await weatherResponse.json();
        skeletonLoader.classList.add('d-none');
        weatherDetail.classList.remove('d-none');
        // const weatherDetail = document.querySelector(".bodyContent");
        // weatherDetail.classList.remove('d-none')
        // console.log(weatherData);
        temperature.innerHTML = tempCoverter(weatherData.current.temp);
        whatfeels.innerHTML = "Feels Like " + weatherData.current.feels_like;
        description.innerHTML = `<i class="fa-brands fa-cloudversify"></i>` + weatherData.current.weather[0].description;
        date.innerHTML = new Date().toDateString();
        humValue.innerHTML = Math.round(weatherData.current.humidity) + "<span>%</span>";
        windValue.innerHTML = weatherData.current.wind_speed + "<span>m/s</span>";
        
        const optionSR = {
            hour: "numeric",
            minute: "numeric",
            hour12: true
        };
        
        const dateOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour12: true
        };
        
        date.innerHTML = getFormateTime(weatherData.current.dt, weatherData.timezone_offset, dateOptions);
        sunRValue.innerHTML = getFormateTime(weatherData.current.sunrise, weatherData.timezone_offset, optionSR);
        sunSValue.innerHTML = getFormateTime(weatherData.current.sunset, weatherData.timezone_offset, optionSR);
        cloudValue.innerHTML = Math.round(weatherData.current.clouds) + "<span>%</span>";
        uvValue.innerHTML = weatherData.current.uvi;
        preValue.innerHTML = Math.round(weatherData.current.pressure) + "<span>hpa</span>";
        
       
        weatherData.daily.forEach(items => {
            const itemsDate = {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            };
            
            let div = document.createElement("div");
            div.classList.add("col-lg-3");
            let div2 = document.createElement("div");
            div2.classList.add("forecast-item", "mt-4", "p-3");
            let dailyWeather = getFormateTime(items.dt, 0, itemsDate).split(" at ");
            div2.innerHTML = dailyWeather[0];
            div2.innerHTML += `<img class="d-flex mx-auto" src="https://openweathermap.org/img/wn/${items.weather[0].icon}@2x.png" />`;
            div2.innerHTML += `<p class="forecast-desc">${items.weather[0].description}</p>`;
            div2.innerHTML += `<span><span>${tempCoverter(items.temp.min)}</span>&nbsp &nbsp<span>${tempCoverter(items.temp.max)}</span></span>`;
            forecast.appendChild(div);
            div.appendChild(div2);
        });
        
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("An error occurred while fetching weather data.");
        skeletonLoader.classList.add('d-none');
    }
}


function formateTime(dateValue, offSet, options = {}) {
    // console.log('dateValue:', dateValue, 'offSet:', offSet); 
    const date = new Date((dateValue + offSet) * 1000);
    // console.log('Calculated Date:', date); 
    return date.toLocaleTimeString([], { timeZone: "UTC", ...options });
}



function getFormateTime(dateValue, offSet, options) {
    return formateTime(dateValue, offSet, options);
}


function tempCoverter(temp){
    let tempValue = Math.round(temp);
    let message = '';
    if (toggle.value === 'C') {
        message = tempValue + "<span>" + "\xB0C</span>";
    } else if (toggle.value === 'F') {
        let fahrenheit = (tempValue * 9)/5 + 32;
        message = Math.round(fahrenheit) + "<span>" + "\xB0F</span>";
    }
    return message;
}

function addtoFavorite(){
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
const cityName = city.innerText;
if(!favorites.includes(cityName)){
    favorites.push(cityName);
    localStorage.setItem('favorites',JSON.stringify(favorites));
    alert(`${cityName} has been added to your favorites.`);
}else{
    alert(`${cityName} is already in your favorites.`);
}
showFav();
}


function showFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    
    favoritesList.innerHTML = "";
    
    favorites.forEach((cityName) => {
        const cityItem = document.createElement("li");
        cityItem.innerText = cityName;
        cityItem.classList.add("dropdown-item");
        cityItem.addEventListener("click", () => {
            searchLocation.value = cityName.split(' , ')[0];
            findLocation();
            
        });
        favoritesList.appendChild(cityItem);
    });
    
   
}

document.addEventListener("DOMContentLoaded", () => {
    showFavorites();
});