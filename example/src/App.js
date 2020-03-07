import React, { Component } from 'react';

// See ../copy-to-example.sh
import { MapInteractionCSS } from 'react-map-interaction';
import Input from './Input';

const OPTIONS = {
  scale: 1,
  disableZoom: false,
  disablePan: false,
  minScale: 0.1,
  maxScale: 5,
  showControls: true,
  disableMouseWheelZoom: false,
  disableSingleTouchPan: false
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      translation: { x: 0, y: 0 },
      ...OPTIONS
    };
  }

  render() {
    const styleContainer = {
      width: `920px`,
      maxWidth: '100%',
      margin: '10px auto',
      padding: '0 10px'
    }

    const styleMap = {
      background: '#fefefe',
      border: '1px solid #efefef',
      height: '600px'
    }

    const styleInputs = {
      border: '1px solid #efefef',
      padding: '10px',
      margin: '10px 0'
    }

    return (
      <div style={styleContainer}>
        <h1>react-map-interaction</h1>
        <p>Add map like zooming and panning to any React element. This works on both touch devices (pinch to zoom, drag to pan) as well as with a mouse or trackpad (wheel scroll to zoom, mouse drag to pan).</p>
        
        <div style={ styleInputs }>
          <h2>Options</h2>
          { Object.keys(OPTIONS).map(key => (
            <Input
              key={ key }
              type={ typeof OPTIONS[key] }
              label={ key }
              value={ this.state[key] }
              onChange={ value => { this.setState({ [key]: value }) } }
            />
          )) }
        </div>

        <div style={ styleMap }>
          <MapInteractionCSS
            { ...this.state }
            translation={ this.state.translation }
            onChange={({ scale, translation }) => this.setState({ scale, translation })}
            defaultScale={ 1 }
            defaultTranslation={{ x: 0, y: 0 }}
          >
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 30, top: 30 }}>
                <button
                  onClick={() => console.log('Click')}
                  onTouchEnd={() => console.log('TouchEnd')}
                  onTouchStart={() => console.log('TouchStart')}
                >
                  Touch/Click Test
                </button>
              </div>
              <img src="/grid.png" style={{ pointerEvents: 'none' }} alt="" />
            </div>
          </MapInteractionCSS>
        </div>
      </div>
    );
  }
}

export default App;
