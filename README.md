# react-map-interaction

Add google map like zooming and panning to any element. The zoom is centered around the user's cursor so you can zoom in on particular areas. The mouse wheel controls zoom. Clicking and dragging controls panning.

![alt tag](./example.gif)

## Example

```js
import MapInteraction from 'react-map-interaction';

// Now the user can zoom and pan thing.png
const ThingMap = () => {
  return (
    <MapInteraction>
      <img src="path/to/thing.png" />
    </MapInteraction>
  );
}
```

## Prop Types (all optional)
```js
{
  // Initial x/y coordinates
  initialX: PropTypes.number,
  initialY: PropTypes.number,

  // The min and max of the scale of the zoom
  minScale: PropTypes.number,
  maxScale: PropTypes.number,

  // Background color of the entire element
  bkgColor: PropTypes.string,

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
