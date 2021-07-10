const APIKey = "295debc1e52ed46e3b3341574a4a9b16"

const getWeatherData = async () => {
    const cityName = "Washington"
    const fetchData = await fetch(`api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}`, {mode: "cors"})
    console.log(fetchData)
}

getWeatherData()