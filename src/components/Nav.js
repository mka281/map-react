import React, { Component } from 'react'

class Map extends Component {
  render() {
    const { toggleListView } = this.props
    return (
      <nav>
        <div id="nav-icon"
             tabIndex="1"
             role="button"
             aria-label="toggle menu"
          onClick={toggleListView}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
    )
  }
}

export default Map
