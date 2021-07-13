import config from "./config.js"

//-----------------------------------------------------------------API Calls-----------------------------------------------------------------

const getCurrentWeatherData = async (city) => {
    const weatherAPIKey = config.weatherAPIKey
    const fetchData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}`, {mode: "cors"})
    return fetchData.json()
}

const oneCallData = async (lon, lat) => {
    const weatherAPIKey = config.weatherAPIKey
    const fetchData = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}`)
    return fetchData.json()
}

const getIPAddress = async () => {
    const url = "http://ip-api.com/json/"
    const clientIP = await fetch(url, {mode: "cors"})
    const clientData = await clientIP.json()
    return clientData.city
}

//-----------------------------------------------------------------Unit converters-----------------------------------------------------------------

const epochConverter = (dt) => {
    let d = new Date(0)
    d.setUTCSeconds(dt)
    return d
}

const convertKelvinToCelsius = (temp) => {
    return Math.round((temp - 273.15)*10)/10
}

//-----------------------------------------------------------------Helper functions -- getters-----------------------------------------------------------------

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

const displayFeelsLike = async (weatherData) => {
    let feelsLike = document.querySelector("#feels-like")
    let temp = Math.round((weatherData.main.feels_like - 273.15)*10)/10
    feelsLike.textContent = `Feels like ${temp}°C`
}

const displayNextSixHours = async (oneCall) => {
    const timezone = oneCall.timezone_offset
    const hourly = oneCall.hourly

    console.log(oneCall)

    for (let i = 1; i < 7; i++) {
        let {dt, temp, feels_like} = hourly[i]
        let {description} = hourly[i].weather[0]
        console.log(getLocalTimeAndDate(dt, timezone), convertKelvinToCelsius(temp), convertKelvinToCelsius(feels_like), description)
    }
}

const displayEverything = async () => {
    let clientLocation = await getIPAddress()
    let weatherData = await getCurrentWeatherData(clientLocation)
    let lon = weatherData.coord.lon
    let lat = weatherData.coord.lat
    let oneCall = await oneCallData(lon, lat)
    displayNextSixHours(oneCall)
    displayTimeAndDate(weatherData)
    displayTemperatureCelsius(weatherData)
    displayFeelsLike(weatherData)
}

displayEverything()
