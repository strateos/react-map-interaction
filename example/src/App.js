import React, { Component } from 'react';

// assumes that you have run `npm link react-map-interaction`
import { MapInteractionCSS } from 'react-map-interaction';

class App extends Component {
  render() {
    // set container node at an origin other than client 0,0 to make sure we handle this case
    return (
      <div style={{ position: 'absolute', top: 50, left: 25 }}>
        <MapInteractionCSS minScale={.05} maxScale={5} showControls>
          <img src="/grid.png" style={{ pointerEvents: 'none' }} alt="" />
        </MapInteractionCSS>
      </div>
    );
  }
}

export default App;
