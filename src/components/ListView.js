import React, { Component } from 'react'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'

class ListView extends Component {

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

    // Function to compare elements of showListings by title
    const compare = (a, b) => {
      if (a.title < b.title)
        return -1;
      if (a.title > b.title)
        return 1;
      return 0;
    }
    // Sort list items by title
    showingLocations.sort(compare);
    return (
      <div id='list-view' role='complementary'>
        <button onClick={showListings} id="show-listings" type="button">Show Markers</button>
        <button onClick={hideListings} id="hide-listings" type="button">Hide Markers</button>
        <div id="search-container">
          <span id="search-icon">
            <i className="fa fa-search"></i>
          </span>
          <input id="search" type='text' placeholder='Filter by name'
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
          />
        </div>
        {showingLocations.length !== markers.length &&
          <div id="search-result-info">
            <span>Showing {showingLocations.length} of {markers.length} total</span>
            <button onClick={clearQuery}>
              Clear Filter
            </button>
          </div>
        }
        <ul id='list'>{showingLocations.map((marker, index)=>
          <li id='list-item' key={index} onClick={() => showOnly(index)} tabIndex="0">
            {marker.title}
          </li>
        )}
        </ul>
      </div>
    )
  }
}

export default ListView
