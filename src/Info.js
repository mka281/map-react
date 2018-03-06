import React, { Component } from 'react'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'

class Info extends Component {

  render() {
    const { showListings, hideListings, updateQuery,
            clearQuery, showOnly, map, query, markers,
          } = this.props

    let showingLocations;
    if (query) {
      // Store locations matched with query in showingLocations
      const match = new RegExp(escapeRegExp(query), 'i')
      showingLocations = markers.filter(marker => match.test(marker.title))
      // Show only checked locations' markers on map
      markers.map(marker => marker.setMap(null))
      showingLocations.map(location => location.setMap(map))
    } else {
      // If there is no match make showLocations include all markers
      showingLocations = markers
    }
    showingLocations.sort(sortBy('name'))


    return (
      <div id='info'>
        <button onClick={showListings} id="show-listings" type="button">Show All</button>
        <button onClick={hideListings} id="hide-listings" type="button">Hide All</button>
        <div id="search-container">
          <span id="search-icon">
            <i className="fa fa-search"></i>
          </span>
          <input id="search" type='text' placeholder='Search'
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
          />
        </div>
        {showingLocations.length !== markers.length &&
          <div id="search-result-info">
            <span>Showing {showingLocations.length} of {markers.length} total</span>
            <button onClick={clearQuery}>
              Show all
            </button>
          </div>
        }
        <div id='list'>{showingLocations.map((marker, index)=>
          <div id='list-item' key={index} onClick={() => showOnly(index)}>
            {marker.title}
          </div>
        )}
        </div>
      </div>
    )
  }
}

export default Info
