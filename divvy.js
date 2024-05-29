// API Endpoints: https://gbfs.divvybikes.com/gbfs/gbfs.json
const url_station = 'https://gbfs.divvybikes.com/gbfs/en/station_information.json'
const url_status = 'https://gbfs.divvybikes.com/gbfs/en/station_status.json'

const favoritesList = document.getElementById('favoritesBar');
var all_stations;
var all_station_status;
var mode;




async function loadStatus() {
    let http_response = await fetch(url_status);
    let station_status_data = await http_response.json();
    let station_status= station_status_data.data.stations;
    all_station_status = station_status;
    return station_status;

}

async function loadStations() {
  let http_response = await fetch(url_station);
  let all_station_data = await http_response.json();
  let stations = all_station_data.data.stations;
  all_stations = stations;
  return stations;

}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("display-all").addEventListener("click", async () => {
      mode = "all";
        navigator.geolocation.getCurrentPosition(async (position) => {
            if (position && position.coords) {
              const userLat = position.coords.latitude;
              const userLon = position.coords.longitude;
              const station_status = await loadStatus();
              const stations = await loadStations();
              renderStations(stations, userLat, userLon, station_status);
              favoritesRenderStations(stations, userLat, userLon, station_status);
          }
        else {
        const station_status = await loadStatus();
        const stations = await loadStations();
        dist_free_renderStations(stations, station_status);
        }
        });
    });
}); 

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("nearest-5").addEventListener("click", async () => {
      mode = "top5";
        navigator.geolocation.getCurrentPosition(async (position) => {
            if (position && position.coords) {
                const userLat = position.coords.latitude;
              const userLon = position.coords.longitude;
              const station_status = await loadStatus();
              const stations = await loadStations();
              topFiveRenderStations(stations, userLat, userLon, station_status);
              favoritesRenderStations(stations, userLat, userLon, station_status);
          }
        else {
        const station_status = await loadStatus();
        const stations = await loadStations();
        dist_free_renderStations(stations, station_status);
        }
        });
    });
}); 







function distance(lat1, lat2, lon1, lon2) {
    //function source: https://www.geeksforgeeks.org/program-distance-two-points-earth/
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    var lon1 =  lon1 * Math.PI / 180;
    var lon2 = lon2 * Math.PI / 180;
    var lat1 = lat1 * Math.PI / 180;
    var lat2 = lat2 * Math.PI / 180;

    // Haversine formula 
    var dlon = lon2 - lon1; 
    var dlat = lat2 - lat1;

    var a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2),2);

    var c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers 6371. Use 3956 
    // for miles
    var r = 3956;
    var dist = c*r;

    var d = Number.parseFloat(dist).toFixed(2)
    // calculate the result
    return(d);
}





class Station {
    constructor(station_data, userLat, userLon, station_status) {
      this.userLat = userLat;
      this.userLon = userLon;
      this.name = station_data.name;
      this.capacity = station_data.capacity;
      this.lat = station_data.lat;
      this.lon = station_data.lon;
      this.id = station_data.station_id;
      this.divId = `divvy_${this.id}`;
      this.distance = distance(userLat, this.lat, userLon, this.lon);
      this.toggleButton = this.toggleButton.bind(this);
      const status = station_status.find(status => status.station_id === station_data.station_id);
      if (typeof status === 'undefined') {
        this.availability = 'N/A';
      }
      else {
        this.availability = status.num_ebikes_available;  
      }
      if (localStorage.getItem(this.divId) !== null){
        this.favorite = true;
      } else {
        this.favorite = false; 
      }
      
    }
  
    render(container_element) {
      const stationContent = document.getElementById("station-card-template").content;
      let newStationElement = stationContent.cloneNode(true);
      newStationElement.querySelector('.station').setAttribute('station-id', `station-${this.id}`);
      newStationElement.querySelector('.station').setAttribute('data-id', `divvy_${this.id}`);
      newStationElement.querySelector('.station-name').textContent = this.name;
      newStationElement.querySelector('.station-capacity').textContent = this.capacity;
      newStationElement.querySelector('.card-link').href = `https://google.com/maps?q=${this.lat},${this.lon}`
      newStationElement.querySelector('.station-distance').textContent = this.distance;
      newStationElement.querySelector('.station-availability').textContent = this.availability;

      const favoriteButton = newStationElement.querySelector('.station-button');
      if (this.favorite === true){
        newStationElement.querySelector('.station-button .button-text').textContent = 'Remove from Favorites';
        favoriteButton.addEventListener('click', () => this.toggleButton(all_stations, this.userLat, this.userLon));
      } else {
        newStationElement.querySelector('.station-button .button-text').textContent = 'Add to Favorites';
        favoriteButton.addEventListener('click', () => {
          this.toggleButton(all_stations, this.userLat, this.userLon);
        })}
      container_element.appendChild(newStationElement);
    }

  async toggleButton(station_data, userLat, userLon) {
    const station_status = await loadStatus()
    const stationId = this.id;
    const newStationElement = document.querySelector(`[data-id="divvy_${stationId}"]`);
    if (this.favorite === true){
      localStorage.removeItem(this.divId);
      this.favorite = false; 
      const buttonTextElement = newStationElement.querySelector('.button-text');
      buttonTextElement.textContent = 'Add to Favorites';

    } else {
      this.favorite = true; 
      localStorage.setItem(this.divId, JSON.stringify(this));
      const buttonTextElement = newStationElement.querySelector('.button-text');
      buttonTextElement.textContent = 'Remove from Favorites';
    }
    if (station_status) {
    clearStations(station_data, userLat, userLon, station_status);
    clearFavoriteStations(station_data, userLat, userLon, station_status);
  }
    this.render(document.getElementById("station-area-section"));
    if (mode === "top5") {
      topFiveRenderStations(station_data, userLat, userLon, station_status)
    } else {
      renderStations(station_data, userLat, userLon, station_status);
    }
    favoritesRenderStations(station_data, userLat, userLon, station_status);

  }

}



class FavoriteStation {
  constructor(station_data, userLat, userLon, station_status) {
    this.userLat = userLat;
    this.userLon = userLon;
    this.name = station_data.name;
    this.capacity = station_data.capacity;
    this.lat = station_data.lat;
    this.lon = station_data.lon;
    this.id = station_data.id;
    this.divId = `divvy_${this.id}`;
    this.distance = distance(userLat, this.lat, userLon, this.lon);
    const status = station_status.find(status => status.station_id === station_data.id);
    if (typeof status === 'undefined') {
      this.availability = 'N/A';
    }
    else {
      this.availability = status.num_ebikes_available;  
    }
    if (localStorage.getItem(this.divId) !== null){
      this.favorite = true;
    } else {
      this.favorite = false; 
    }
    
  }

  render(container_element) {
    console.log(this);
    if (this.favorite === true){
      console.log(this.availability)
      const favTemplate = document.getElementById("fav-template");
      console.log(favTemplate); 
      let newFavBarElement = favTemplate.content.cloneNode(true);
      newFavBarElement.querySelector('.favorite-station').setAttribute('fav-station-id', `station-${this.id}`);
      newFavBarElement.querySelector('.favorite-station').setAttribute('fav-data-id', `divvy_${this.id}`);
      newFavBarElement.querySelector('.favorite-name').textContent = this.name;
      newFavBarElement.querySelector('.favorite-capacity').textContent = this.capacity;
      newFavBarElement.querySelector('.favorite-link').href = `https://google.com/maps?q=${this.lat},${this.lon}`
      newFavBarElement.querySelector('.favorite-distance').textContent = this.distance;
      newFavBarElement.querySelector('.favorite-availability').textContent = this.availability;
      container_element.appendChild(newFavBarElement);
    }
  }


}






function renderStations(station_data, userLat, userLon, station_status) {
    const stationCard = document.getElementById("station-area-section");
    
    clearStations(station_data, userLat, userLon, station_status);
    
    let stationCards = [];
    station_data.forEach( (station_data) => {
      let newStation = new Station(station_data, userLat, userLon, station_status);
      stationCards.push(newStation)
    })
    stationCards.sort((firstItem, secondItem) =>
        firstItem.distance - secondItem.distance
    )
    stationCards.forEach((s) => {
        s.render(stationCard)
})
  }

function topFiveRenderStations(station_data, userLat, userLon, station_status) {
    const stationCard = document.getElementById("station-area-section");

    clearStations(station_data, userLat, userLon, station_status);

    let stationCards = [];
    station_data.forEach( (stations) => {
      let newStation = new Station(stations, userLat, userLon, station_status);
      stationCards.push(newStation);
    })
    stationCards.sort((firstItem, secondItem) =>
        firstItem.distance - secondItem.distance
    )
    stationCards.slice(0,5).forEach((s) => {
        s.render(stationCard);
      })
  }
function favoritesRenderStations(station_data, userLat, userLon, station_status) {
    document.getElementById('favoritesBar').style.right = '0';

    const sidebar = document.getElementById("favoritesBar");
    clearFavoriteStations(station_data, userLat, userLon, station_status);

    // console.log("Favorite station template:", document.getElementById("fav-template")); 
    console.log("Stations:", station_data);
    let favStationCards = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      // console.log(key)
      if (key.startsWith('divvy_')) {
          const station = JSON.parse(localStorage.getItem(key));
          // console.log(station)
          if (station.favorite === true) {
            // console.log('was favorite!')
            console.log(station.availability)
              const newStation = new FavoriteStation(station, userLat, userLon, station_status);
              favStationCards.push(newStation)
          }
      }
  }
  favStationCards.sort((firstItem, secondItem) =>
    firstItem.distance - secondItem.distance
)
    favStationCards.forEach((s) => {
      console.log(s);
      s.render(sidebar);
    });
}

function clearStations(station_data, userLat, userLon, station_status) {
  const stationContainer = document.getElementById("station-area-section");
  const stationElements = stationContainer.querySelectorAll('.station');

  stationElements.forEach(stationElement => {
    const dataId = stationElement.getAttribute('data-id');
    if (dataId && dataId.startsWith('divvy_')) {
      const id = dataId.replace('divvy_', ''); 
      const matchedStation = station_data.find(stations => stations.station_id === id);
      if (matchedStation) {
        stationElement.remove();
      }
    }
  });
}

function clearFavoriteStations(station_data, userLat, userLon, station_status) {
  const sidebar = document.getElementById("favoritesBar");
  const favStationElements = sidebar.querySelectorAll('.favorite-station');

  favStationElements.forEach(favStationElement => {
    const dataId = favStationElement.getAttribute('fav-data-id');
    if (dataId && dataId.startsWith('divvy_')) {
      const id = dataId.replace('divvy_', ''); 
      const matchedStation = station_data.find(stations => stations.station_id === id);
      if (matchedStation) {
        favStationElement.remove(); 
      }
    }
  });
}

  class dist_free_Station {
    constructor(station_data, station_status) {
      this.name = station_data.name;
      this.capacity = station_data.capacity;
      this.lat = station_data.lat
      this.lon = station_data.lon
      this.distance = 'N/A'
      const status = station_status.find(status => status.station_id === station_data.station_id);
      if (typeof status === 'undefined') {
        this.availability = 'N/A';
      }
      else {
        this.availability = status.num_ebikes_available;  
      }
      this.toggleButton = this.toggleButton.bind(this);
    }
  
    render(container_element) {
      const stationContent = document.getElementById("station-card-template").content;
      let newStationElement = stationContent.cloneNode(true);
      newStationElement.querySelector('.station-name').textContent = this.name;
      newStationElement.querySelector('.station-capacity').textContent = this.capacity;
      newStationElement.querySelector('.card-link').href = `https://google.com/maps?q=${this.lat},${this.lon}`
      newStationElement.querySelector('.station-distance').textContent = this.distance;
      newStationElement.querySelector('.station-availability').textContent = this.availability;
      const favoriteButton = newStationElement.querySelector('.station-button');
      favoriteButton.addEventListener('click', this.toggleButton);
      container_element.appendChild(newStationElement);
    }
  }

function dist_free_renderStations(station_data, station_status) {
    const stationCard = document.getElementById("_stations");
    station_data.forEach( (station) => {
      let newStation = new dist_free_Station(station, station_status);
      newStation.render(stationCard)
    })
}


