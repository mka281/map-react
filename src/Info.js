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
        <input onClick={showListings} id="show-listings" type="button" value="Show Listings"/>
        <input onClick={hideListings} id="hide-listings" type="button" value="Hide Listings"/>
        <input id="search"
          type='text'
          placeholder='Search'
          value={query}
          onChange={(event) => updateQuery(event.target.value)}
        />
        {showingLocations.length !== markers.length &&
          <div>
            <span>Now showing {showingLocations.length} of {markers.length} total</span>
            <button onClick={clearQuery}>
              Show all
            </button>
          </div>
        }
        <div id='list'>{showingLocations.map((marker, index)=>
          <div key={index} onClick={() => showOnly(index)}>
          <br/>{marker.title}<hr/>
          </div>
        )}
        </div>
      </div>
    )
  }
}

export default Info
