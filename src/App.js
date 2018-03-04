import React, { Component } from 'react'
import Nav from './Nav'
import Info from './Info'
import Map from './Map'
import './App.css'

class App extends Component {
  state = {
    map: {},
    // Infos required to create a map
    zoom: 12,
    center: {lat: 40.7347062, lng: -73.9895759},
    // Create locations manually instead of a database. Copied from:
    // https://github.com/udacity/ud864/blob/master/Project_Code_3_WindowShoppingPart1.html
    locations: [
      {
        title: 'Park Ave Penthouse',
        location: {lat: 40.7713024, lng: -73.9632393},
        foursquareId: "4b83992ef964a520dd0a31e3"
      },{
        title: 'Chelsea Loft',
        location: {lat: 40.7444883, lng: -73.9949465},
        foursquareId: "4b824a4bf964a5202dcf30e3"
      },{
        title: 'Union Square Open Floor Plan',
        location: {lat: 40.7347062, lng: -73.9895759},
        foursquareId: "4bc8088f15a7ef3b6b857ada"
      },{
        title: 'East Village Hip Studio',
        location: {lat: 40.7281777, lng: -73.984377},
        foursquareId: "4bc8088f15a7ef3b6b857ada"
      },{
        title: 'TriBeCa Artsy Bachelor Pad',
        location: {lat: 40.7195264, lng: -74.0089934},
        foursquareId: "4bc8088f15a7ef3b6b857ada"
      },{
        title: 'Chinatown Homey Space',
        location: {lat: 40.7180628, lng: -73.9961237},
        foursquareId: "52303b6111d23260984e7830"
      }
    ],
    markers: [],
    query: "",
  }

  componentDidMount() {
    const { google } = window
    const { zoom, center, locations, markers } = this.state

    // Create map
    let map = new google.maps.Map(document.getElementById('map'), {
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
      // Open infowindow when marker and set marker the center of the map
      marker.addListener('click', function() {
        infowindow.open(map, marker);
        map.setCenter(position)
      });

      // FOURSQUARE API REQUEST
      const placeId = item.foursquareId
      const fsqApiUrl = `https://api.foursquare.com/v2/venues/${placeId}?&oauth_token=FEBDSPSSOAXMNNWDMD1ZUCSYEDBYLRWQ31APQF11OB2OB1UN&v=20180303`
      fetch(fsqApiUrl)
      .then(res => { return res.json() })
      .then(data => { return data.response.venue })
      .then(venue => {
        console.log(venue)
        const { bestPhoto, description, rating, ratingColor,
                isOpen, url, fsqUrl } = venue
        const size = "250x200"
        const photoURL = bestPhoto.prefix + size + bestPhoto.suffix;
        const info = { photoURL, description, rating, ratingColor, isOpen, url, fsqUrl }
        return info
      })
      .then(info => {
        infowindow.setContent(
          `<div>
            <h3>${title}</h3>
            <p>${info.description}</p>
            <img src="${info.photoURL}"/>
            <span style="color:#${info.ratingColor}; font-weight:bold">${info.rating}</span>
            <span>${info.isOpen ? "Open Now" : "Closed Now"}</span>
            <a href="${info.url}">${info.url ? "Official Website" : ""}</a>
            <a href="${info.fsqUrl}">View on Foursquare</a>
          </div>`
        )
      })
      .catch(err => { console.log(err) })
    })
  }

  hideListings = () => {
    const { markers } = this.state
    markers.map(marker =>
      this.setState(marker.setMap(null))
    )
  }
  showListings = () => {
    const { markers, map } = this.state
    markers.map(marker =>
      this.setState(marker.setMap(map))
    )
  }
  showOnly = (e) => {
    const { markers, map } = this.state
    // Remove markers except the clicked one
    markers.filter((marker, index) => index !== e).map(marker=>
      marker.setMap(null)
    )
    // Get back the marker of the clicked one if it is removed before
    markers[e].setMap(map)
  }
  updateQuery = (query) => {
    this.setState({ query: query.trim() })
  }
  clearQuery = () => {
    this.setState({ query: "" })
  }
  toggleInfoDiv = () => {
    const infoDiv = document.getElementById('info')
    const mapDiv = document.getElementById('map')
    if (infoDiv.style.display === "none") {
        infoDiv.style.display = "block"
        mapDiv.style.width = "73%"
    } else {
        infoDiv.style.display = "none"
        mapDiv.style.width = "100%"
    }
  }
  render() {
    const { map, zoom, center, markers, query } = this.state
    const { hideListings, showListings, showOnly, updateQuery,
            clearQuery, toggleInfoDiv } = this
    return (
      <div id='app'>
        <Nav
          toggleInfoDiv={toggleInfoDiv}
        />
        <Info
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
