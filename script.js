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

async function findLocation() {
    forecast.innerHTML = "";
    
    try {
        // Fetch location data
        const locationResponse = await fetch(WEATHER_API + searchLocation.value);
        const locationData = await locationResponse.json();
        
        if (locationData.cod !== "" && locationData.cod !== 200) {
            alert(locationData.message);
            return;
        }
        
        console.log(locationData);
        city.innerHTML = locationData.name + " , " + locationData.sys.country;
        weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${locationData.weather[0].icon}@2x.png)`;
        
        // Fetch weather data
        const weatherResponse = await fetch(WEATHER_DATA + `lon=${locationData.coord.lon}&lat=${locationData.coord.lat}`);
        const weatherData = await weatherResponse.json();
        const weatherDetail = document.querySelector(".weather-detail");
        weatherDetail.classList.remove('d-none')
        console.log(weatherData);
        temperature.innerHTML = weatherData.current.temp;
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
            let dailyWeather = getFormateTime(items.dt, 0, itemsDate).split(" at ");
            div.innerHTML = dailyWeather[0];
            div.innerHTML += `<img src="https://openweathermap.org/img/wn/${items.weather[0].icon}@2x.png" />`;
            div.innerHTML += `<p class="forecast-desc">${items.weather[0].description}</p>`;
            forecast.appendChild(div);
        });
        
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("An error occurred while fetching weather data.");
    }
}


function formateTime(dateValue, offSet, options = {}) {
    console.log('dateValue:', dateValue, 'offSet:', offSet); 
    const date = new Date((dateValue + offSet) * 1000);
    console.log('Calculated Date:', date); 
    return date.toLocaleTimeString([], { timeZone: "UTC", ...options });
}



function getFormateTime(dateValue, offSet, options) {
    return formateTime(dateValue, offSet, options);
}