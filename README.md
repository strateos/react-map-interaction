# react-map-interaction

Add map like zooming and panning to any React element. This works on both touch devices (pinch to zoom, drag to pan) as well as with a mouse or trackpad (wheel scroll to zoom, mouse drag to pan).

![example zooming map](./example.gif)

## Install
```bash
npm install --save react-map-interaction
```

## Examples

```js
import { MapInteractionCSS } from 'react-map-interaction';

// This component uses CSS to scale your content.
// Just pass in content as children and it will take care of the rest.
const ThingMap = () => {
  return (
    <MapInteractionCSS>
      <img src="path/to/thing.png" />
    </MapInteractionCSS>
  );
}
```

```js
import { MapInteraction } from 'react-map-interaction';

// Use MapInteraction if you want to determine how to use the resulting translation.
const ImInControl = () => {
  <MapInteraction>
    {
      ({ translation, scale }) => { /* Use the passed values to scale content on your own. */ }
    }
  </MapInteraction>
}
```

## Prop Types for MapInteractionCSS (all optional)
```js
{
  // Initial x/y coordinates
  initialX: PropTypes.number,
  initialY: PropTypes.number,

  // The min and max of the scale of the zoom. Must be > 0.
  minScale: PropTypes.number,
  maxScale: PropTypes.number,

  // When 'showControls' is 'true', plus/minus buttons are rendered
  // that let the user control the zoom factor
  showControls: PropTypes.bool,

  // Content to render in each of the control buttons (only when 'showControls' is 'true')
  plusBtnContents: PropTypes.node,
  minusBtnContents: PropTypes.node,

  // Class applied to the plus/minus buttons (only when 'showControls' is 'true')
  btnClass: PropTypes.string
};
```

## Prop Types for MapInteraction (all optional)
```js
{
  // Function called with an object { translation, scale }
  // translation: { x: number, y: number }, The current origin of the content
  // scale:       number, The current multiplier mapping original coordinates to current coordinates
  children: PropTypes.func,

  // The rest of the prop types are the same as MapInteractionCSS
  ...MapInteractionCSS.propTypes,
}
```
