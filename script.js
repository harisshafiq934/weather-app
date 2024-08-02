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

 WEATHER_API=`https://api.openweathermap.org/data/2.5/weather?appid=0c93b9a1e09d8a89b33a9a635bb87add&q=`;
 WEATHER_DATA=`https://api.openweathermap.org/data/3.0/onecall?appid=0c93b9a1e09d8a89b33a9a635bb87add&exclude=minutely&units=metric&`;

// async function findLocation(){
//     let location = "London";
//     const res = await fetch(`${WEATHER_API}${location}`);
//     data = await res.json();
//     console.log(data);
//     updateData();

// }

function findLocation(){
    forecast.innerHTML = "";
    fetch(WEATHER_API + searchLocation.value)
    .then((res) => res.json())
    .then((data) => {
       
        if(data.cod != "" && data.cod != 200){
            alert(data.message);
            return;
        }
        console.log(data);
        city.innerHTML = data.name + " , " + data.sys.country;
        weatherIcon.style.background=`url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;
        fetch(WEATHER_DATA + `lon=${data.coord.lon}&lat=${data.coord.lat}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            temperature.innerHTML = data.current.temp;
            whatfeels.innerHTML = "Feels Like" +data.current.feels_like;
            description.innerHTML = `<i class="fa-brands fa-cloudversify"></i>` + data.current.weather[0].description;
            date.innerHTML = new Date().toDateString();
            humValue.innerHTML = Math.round(data.current.humidity) + "<span>%</span>";
            windValue.innerHTML = data.current.wind_speed + "<span>m/s</span>";
            const optionSR = {
                hour: "numeric",
                minute: "numeric",
                hour12: true
            }
            const dateOptions = {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour12:true
            }
            date.innerHTML = getFormateTime(data.current.dt, data.timezone_offset, dateOptions);
            sunRValue.innerHTML = getFormateTime(data.current.sunrise, data.timezone_offset, optionSR);
            sunSValue.innerHTML = getFormateTime(data.current.sunset, data.timezone_offset, optionSR);
            cloudValue.innerHTML = Math.round(data.current.clouds) + "<span>%</span>";
            uvValue.innerHTML = data.current.uvi;
            preValue.innerHTML = Math.round(data.current.pressure) + "<span>hpa</span>";
            data.daily.forEach(items => {
                const itemsDate = {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                
                }
                let div = document.createElement("div");
                let dailyWeather = getFormateTime(items.dt, 0, itemsDate).split(" at ");
                div.innerHTML = dailyWeather[0]
                div.innerHTML+=`<img src="https://openweathermap.org/img/wn/${items.weather[0].icon}@2x.png" />`
                div.innerHTML+= `<p calss="forecast-desc">${items.weather[0].description} </p>`
                forecast.appendChild(div);
            });

            
        })
       
    })
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