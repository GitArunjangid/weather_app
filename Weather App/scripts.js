const userTab =document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// initially variables needed
let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
const API_KEY_2 = "HNhRqTTo1PnEPAqcrSXuC9Cqs0C9K5q3"
oldTab.classList.add("current-tab");
getfromSessionStorage();


function switchTab(newTab){
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");
        
        if(!searchForm.classList.contains("active")){
            //check kya search tab vala container invisisble hai, agar hai to ise visible karo
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //main pahle search  wale tab par tha, ab your weather wale tab visible karna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather vale tab me aa gaya hu, toh weather bhi display karna padega , so lets check for local storage
            // for coordinates, if we have saved them there
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

//check if coordinates are already present in session storage
function getfromSessionStorage(){
    let localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        let coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API Call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
          userInfoContainer.classList.add("active");
          console.log("ERROR 404");
    }
}

function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch the element
    const cityName = document.querySelector("[data-countryName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    
    //fetch values from weatherInfo object , and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("geolocation not supported");
    }
}

function showPosition(position){
    const userCoordinates = {
         lat: position.coords.latitude,
         lon: position.coords.longitude,
    }
   sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
   fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getlocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName =searchInput.value;

    if(cityName === "")
        return;
    else
       fetchSearchWeatherInfo(cityName);
       

})

async function fetchSearchWeatherInfo(city){
      loadingScreen.classList.add("active");
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");

      try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
      }
      catch(err){
         console.log("ERROR 404");
      }
}


// async function getKey(city){
//     const key = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${API_KEY_2}&q=${city}`);
//     const data = await key.json();
//     console.log([data]);
// }

