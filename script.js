const config = {
    weatherAPIKey: "295debc1e52ed46e3b3341574a4a9b16",
}
//-----------------------------------------------------------------API Calls-----------------------------------------------------------------

const getCurrentWeatherData = async (city) => {
    const weatherAPIKey = config.weatherAPIKey
    try {
        const fetchData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}`, {mode: "cors"})
        return fetchData.json()
    } catch (err) {
        console.log("Oopsie something went wrong.")
    }
}

const oneCallData = async (lon, lat) => {
    const weatherAPIKey = config.weatherAPIKey
    try {
        const fetchData = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}`)
        return fetchData.json()
    } catch (err) {
        console.log("Oopsie something went wrong.")
    }
}

const getIPAddress = async () => {
    const url = "http://ip-api.com/json/"
    try {
        const clientIP = await fetch(url, {mode: "cors"})
        const clientData = await clientIP.json()
        return clientData.city
    } catch (err) {
        console.log(err)
    }
}

//-----------------------------------------------------------------Helper functions -- getters-----------------------------------------------------------------

const epochConverter = (dt) => {
    let d = new Date(0)
    d.setUTCSeconds(dt)
    return d
}

const convertKelvinToCelsius = (temp) => {
    return Math.round((temp - 273.15)*10)/10
}


const getLocalTimeAndDate = (time, timezone) => {
    let clientTimeZone = new Date().getTimezoneOffset()
    clientTimeZone *= 60 
    //convert to seconds 
    let localTime = time + clientTimeZone + timezone
    //add client timezone to get UTC +0 time. convert to local time by adding timezone afterwards. 
    
    let d = epochConverter(localTime)
    let date = new Intl.DateTimeFormat("en-GB", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit"}).format(d)
    return date
}

//-----------------------------------------------------------------Helper functions -- setters-----------------------------------------------------------------

const displayTimeAndDate = async (weatherData) => {
    let date = document.querySelector("#date-time")
    let d = getLocalTimeAndDate(weatherData.dt, weatherData.timezone)

    date.textContent = d
}

const displayTemperatureCelsius = async (weatherData) => {
    let currentTemp = document.querySelector("#current-temp")
    let maxTemp = document.querySelector("#max-temp")
    let minTemp = document.querySelector("#min-temp")

    let current_Temp = convertKelvinToCelsius(weatherData.main.temp)
    let max_Temp = convertKelvinToCelsius(weatherData.main.temp_max)
    let min_Temp = convertKelvinToCelsius(weatherData.main.temp_min)

    currentTemp.textContent = `${current_Temp}°C`
    maxTemp.textContent = `${max_Temp}°C ᐃ`
    minTemp.textContent = `${min_Temp}°C ᐁ`
}

const displayCurrentWeather = async (weatherData) => {
    let currentWeather = document.querySelector("#current-weather")
    let {icon} = weatherData.weather[0]

    currentWeather.innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`
}

const displayFeelsLike = async (weatherData) => {
    let feelsLike = document.querySelector("#feels-like")
    let temp = Math.round((weatherData.main.feels_like - 273.15)*10)/10
    feelsLike.textContent = `feels like ${temp}°C`
}

const displayCountry = async (weatherData) => {
    let country = document.querySelector("#country")
    country.textContent = weatherData.name
}

const displayNextSixHours = async (oneCall) => {
    const timezone = oneCall.timezone_offset
    const hourly = oneCall.hourly

    const createForecastSubCtn = () => {
        const tempForecastContainer = document.querySelector("#temp-forecast-ctn")
        //remove previous elements
        tempForecastContainer.textContent = ""
        for (let i = 1; i < 7; i++) {
            let {dt, temp, feels_like} = hourly[i]
            let {icon} = hourly[i].weather[0]
            let iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`
            let localTime = getLocalTimeAndDate(dt, timezone)
            let currentTemp = convertKelvinToCelsius(temp)
            let feelsLike = convertKelvinToCelsius(feels_like)
            tempForecastContainer.innerHTML += `
                <div class="forecast">
                    <div class="description"><img src=${iconUrl}></div>
                    <div class="time">${localTime}</div>
                    <div class="current-temp">${currentTemp}°C</div>
                    <div class="feels-like">feels like ${feelsLike}°C</div>
                </div>
            `
        }
    }

    createForecastSubCtn()
}

const displayEverything = async (location) => {
    let weatherData = await getCurrentWeatherData(location)
    let lon = weatherData.coord.lon
    let lat = weatherData.coord.lat
    let oneCall = await oneCallData(lon, lat)
    displayCountry(weatherData)
    displayTimeAndDate(weatherData)
    displayCurrentWeather(weatherData)
    displayTemperatureCelsius(weatherData)
    displayFeelsLike(weatherData)
    displayNextSixHours(oneCall)
}

(async () => {
    let clientLocation = await getIPAddress()
    displayEverything(clientLocation)

    const searchBtn = document.querySelector(".search")
    const searchInput = document.querySelector("#search")
    searchBtn.addEventListener("click", () => {
            displayEverything(searchInput.value)
            searchInput.value = ""
        }
    )
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            displayEverything(e.target.value)
            searchInput.value = ""
        }
    })
})();