import React, { Component } from "react"
import Nav from "./components/Nav"
import ListView from "./components/ListView"
import Map from "./components/Map"

class App extends Component {
  state = {
    map: {},
    // Infos required to create a map
    zoom: 10,
    center: {lat: 41.0082, lng: 28.9784},
    // Create locations manually
    locations: [
      {
        title: "Istanbul Archeology Museums",
        location: {lat: 41.01131911544835, lng: 28.9807878655699},
        foursquareId: "4c0b5171009a0f47f7feeabf"
      },{
        title: "Hagia Sophia",
        location: {lat: 41.008203152757076, lng: 28.97866174266371},
        foursquareId: "4bc8088f15a7ef3b6b857ada"
      },{
        title: "Blue Mosque",
        location: {lat: 41.00592108611381, lng: 28.976922165776163},
        foursquareId: "4b753a2af964a520d4012ee3"
      },{
        title: "Topkapı Palace",
        location: {lat: 41.010589915507516, lng: 28.98174859064375},
        foursquareId: "4b824a4bf964a5202dcf30e3"
      },{
        title: "Prince\"s Islands",
        location: {lat: 40.88003522603099, lng: 29.07909393310547},
        foursquareId: "4e05b8f71838eb15aef5d436"
      },{
        title: "Pierre Loti",
        location: {lat: 41.05353347903194, lng: 28.933392265414366},
        foursquareId: "4b83be45f964a520e00e31e3"
      }
    ],
    markers: [],
    query: "",
  }

  componentDidMount() {
    // Connect the initMap() function within this class to the global window context,
    // so Google Maps can invoke it
    window.initMap = this.initMap;
    // Asynchronously load the Google Maps script, passing in the callback reference
    loadJS("https://maps.googleapis.com/maps/api/js?key=AIzaSyCKJKxBvLox412iS0XbbDGOZpIPe1DLQ6w&callback=initMap")
  }

  initMap = () => {
    const { google } = window
    const { zoom, center, locations, markers } = this.state

    // Create map
    let map = new google.maps.Map(document.getElementById("map"), {
      center,
      zoom,
    });
    this.setState({ map })

    // Crate a marker for each item of locations array
    locations.map(item => {
      let position = item.location
      let title = item.title
      // Marker constructor
      let marker = new google.maps.Marker({
        position,
        title,
        map
      })
      markers.push(marker)
      this.setState({ markers })

      // Infowindow constructor
      let infowindow = new google.maps.InfoWindow({
        maxWidth: 250
      });

      marker.addListener("click", () => {
        // Toggle infowindow when marker is clicked
        if (!marker.open) {
          infowindow.open(map, marker);
          marker.open = true;
        } else {
          infowindow.close();
          marker.open = false;
        }

        // Set marker the center of the map
        map.setCenter(position)
      });

      // Close infowindows when anywhere in the map is clicked
      google.maps.event.addListener(map, "click", () => {
        infowindow.close();
        marker.open = false;
      });

      // FOURSQUARE API REQUEST
      const placeId = item.foursquareId
      const fsqApiUrl = `https://api.foursquare.com/v2/venues/${placeId}?&oauth_token=FEBDSPSSOAXMNNWDMD1ZUCSYEDBYLRWQ31APQF11OB2OB1UN&v=20180303`
      fetch(fsqApiUrl)
        .then(res => { return res.json() })
        .then(data => { return data.response.venue })
        .then(venue => {
          const { bestPhoto, description, rating, ratingColor,
                  isOpen, url, fsqUrl } = venue
          const size = "250x200"
          const photoURL = bestPhoto.prefix + size + bestPhoto.suffix;
          const info = { photoURL, description, rating, ratingColor, isOpen, url, fsqUrl }
          return info
        })
        .then(info => {
          infowindow.setContent(
            `<div style="text-align: center">
              <h3 tabIndex="0">${title}</h3>
              <p>${info.description ? info.description : ""}</p>
              <img alt="${title} photo" src="${info.photoURL}"/>
              <span style="color:#${info.ratingColor}; font-weight:bold">${info.rating}</span><br>
              <span>${info.isOpen ? "Open Now" : "Closed Now"}</span><br>
              <a href="${info.fsqUrl}">View on Foursquare</a><br>
              <a href="${info.url}">${info.url ? "Visit Official Website" : ""}</a>
            </div>`
          )
        })
        .catch(err => { console.log(err) })

    })
  }

  // Hide all markers on the map
  hideListings = () => {
    const { markers } = this.state
    markers.map(marker =>
      this.setState(marker.setMap(null))
    )
  }

  // Show all markers on the map
  showListings = () => {
    const { markers, map } = this.state
    markers.map(marker =>
      this.setState(marker.setMap(map))
    )
  }

  // When a location clicked on the list, show only its marker on the map
  showOnly = (e) => {
    const { markers, map } = this.state
    // Remove markers except the clicked one
    markers.filter((marker, index) => index !== e).map(marker=>
      marker.setMap(null),
    )
    // Get back the marker of the clicked one if it is removed before
    markers[e].setMap(map)
    markers[e].setAnimation(window.google.maps.Animation.DROP)
    // Make marker the map center
    map.setCenter(markers[e].position)
  }

  // Change state when filter input changes
  updateQuery = (query) => {
    this.setState({ query: query.trim() })
  }

  // Clear filter by name input
  clearQuery = () => {
    this.setState({ query: "" })
  }

  // Toggle display status of ListView
  toggleListView = () => {
    const listDiv = document.getElementById("list-view")
    const mapDiv = document.getElementById("map")
    if (listDiv.style.display === "none") {
      listDiv.style.display = "block"
      if (window.screen.width > 800) {
        mapDiv.style.width = "73%"
      }
    } else {
      listDiv.style.display = "none"
      mapDiv.style.width = "100%"
    }
  }

  render() {
    const { map, zoom, center, markers, query } = this.state
    const { hideListings, showListings, showOnly, updateQuery,
            clearQuery, toggleListView } = this
    return (
      <div id="app">
        <Nav
          toggleListView={toggleListView}
        />
        <ListView
          map={map}
          zoom={zoom}
          center={center}
          markers={markers}
          query={query}
          hideListings={hideListings}
          showListings={showListings}
          showOnly={showOnly}
          updateQuery={updateQuery}
          clearQuery={clearQuery}
        />
        <Map />
      </div>
    );
  }
}

export default App;

// LoadJS function to load googla maps asynchronously
function loadJS(src) {
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  ref.parentNode.insertBefore(script, ref);
}
