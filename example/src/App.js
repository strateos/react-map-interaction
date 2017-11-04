import React, { Component } from 'react';

// assumes that you have run `npm link react-map-interaction`
import { MapInteractionCSS } from 'react-map-interaction';

class App extends Component {
  render() {
    return (
      <MapInteractionCSS minScale={.05} maxScale={5}>
        <img src="/grid.png" style={{ pointerEvents: 'none' }} alt="" />
      </MapInteractionCSS>
    );
  }
}

export default App;
