import React, { Component } from 'react'

class Map extends Component {
  render() {
    const { toggleInfoDiv } = this.props
    return (
      <nav>
        <div id="nav-icon"
             tabIndex="1"
             role="button"
             aria-label="toggle menu"
          onClick={toggleInfoDiv}
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
