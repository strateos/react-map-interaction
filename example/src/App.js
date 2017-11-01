import React, { Component } from 'react';

// assumes that you have run `npm link react-map-interaction`
import MapInteraction from 'react-map-interaction';

class App extends Component {
  render() {
    return (
      <MapInteraction minScale={.05} maxScale={5} debug>
        <img src="/grid.png" style={{ pointerEvents: 'none' }} alt="" />
      </MapInteraction>
    );
  }
}

export default App;
