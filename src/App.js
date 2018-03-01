import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    map: {},
    // Infos required to create a map
    zoom: 12,
    center: {lat: 40.7347062, lng: -73.9895759},
    // Create locations manually instead of a database. Copied from:
    // https://github.com/udacity/ud864/blob/master/Project_Code_3_WindowShoppingPart1.html
    locations: [
      {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
      {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
      {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
      {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
      {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
      {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
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
        content: title
      });
      // Open infowindow when marker is clicked
      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
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

  render() {
    const { showListings, hideListings, updateQuery, showOnly } = this
    const { query, markers } = this.state
    return (
      <div id='app'>
        <div id='info'>
          <input onClick={showListings} id="show-listings" type="button" value="Show Listings"/>
          <input onClick={hideListings} id="hide-listings" type="button" value="Hide Listings"/>
          <input
            type='text'
            placeholder='Search'
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
          />
          <div id='list'>{markers.map((marker, index)=>
            <div key={index} onClick={() => showOnly(index)}>
            <br/>{marker.title}<hr/>
            </div>
          )}
          </div>
        </div>
        <div id='map' />
      </div>
    );
  }
}

export default App;
