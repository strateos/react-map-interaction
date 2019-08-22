import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { MapInteractionCSS } from '../src';
import gridImg from './grid.png';

const BLUE_BORDER = '1px solid blue';

storiesOf('MapInteractionCSS', module)
  .add('Grid', () => {
    return (
      <div style={{ width: 500, height: 500, border: BLUE_BORDER }}>
        <MapInteractionCSS>
          <img src={gridImg} style={{ pointerEvents: 'none' }} alt="" />
        </MapInteractionCSS>
      </div>
    )
  })
  .add('Button inside', () => {
    return (
      <div style={{ width: 500, height: 500, border: BLUE_BORDER }}>
        <MapInteractionCSS>
          <button
            onClick={(e) => {
              console.log('inside on click')
              console.log("e.defaultPrevented: ", e.defaultPrevented);
              if (e.defaultPrevented) {
                action('Drag!')();
              } else {
                action("Click!")();
              }
            }}
            onTouchEnd={(e) => {
              console.log('inside on click')
              console.log("e.defaultPrevented: ", e.defaultPrevented);
              if (e.defaultPrevented) {
                action('Drag!')();
              } else {
                action("Click!")();
              }
            }}
          >
          click me
        </button>
        </MapInteractionCSS>
      </div>
    );
  })
  .add('2 on screen', () => {
    return (
      <div>
        <div style={{ width: 500, height: 500, border: BLUE_BORDER }}>
          <MapInteractionCSS>
            <button onClick={action('click 1')}>click me</button>
          </MapInteractionCSS>
        </div>
        <br />
        <div style={{ width: 500, height: 500, border: BLUE_BORDER }}>
          <MapInteractionCSS>
            <button onClick={action('click 2')}>click me</button>
          </MapInteractionCSS>
        </div>
      </div>
    );
  })
  .add('Click element outside', () => {
    return (
      <div>
        <div style={{ width: 500, height: 500, border: BLUE_BORDER }}>
          <MapInteractionCSS>
            <img src={gridImg} style={{ pointerEvents: 'none' }} alt="" />
          </MapInteractionCSS>
        </div>
        <br />
        <button onClick={action('click')}>click me</button>
      </div>
    )
  })
  .add('Text input outside', () => {
    return (
      <div>
        <div style={{ width: 500, height: 500, border: BLUE_BORDER }}>
          <MapInteractionCSS>
            <img src={gridImg} style={{ pointerEvents: 'none' }} alt="" />
          </MapInteractionCSS>
        </div>
        <br />
        <input type="text" onChange={action('onChange')} />
      </div>
    )
  })
  .add('Controls', () => {
    return (
      <div style={{ width: 500, height: 500, border: BLUE_BORDER }}>
        <MapInteractionCSS showControls>
          <img src={gridImg} style={{ pointerEvents: 'none' }} alt="" />
        </MapInteractionCSS>
      </div>
    )
  })
