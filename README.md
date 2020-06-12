# react-map-interaction

Add map like zooming and panning to any React element. This works on both touch devices (pinch to zoom, drag to pan) as well as with a mouse or trackpad (wheel scroll to zoom, mouse drag to pan).

![example zooming map](./example.gif)

## Install
```bash
npm install --save react-map-interaction
```

## Usage

### Basic
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

### Usage without CSS
```js
import { MapInteraction } from 'react-map-interaction';

// Use MapInteraction if you want to determine how to use the resulting translation.
const NotUsingCSS = () => {
  return (
    <MapInteraction>
      {
        ({ translation, scale }) => { /* Use the passed values to scale content on your own. */ }
      }
    </MapInteraction>
  );
}
```

### Controlled
```js
import { MapInteractionCSS } from 'react-map-interaction';

// If you want to have control over the scale and translation,
// then use the `scale`, `translation`, and `onChange` props.
class Controlled extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        scale: 1,
        translation: { x: 0, y: 0 }
      }
    };
  }

  render() {
    const { scale, translation } = this.state;
    return (
      <MapInteractionCSS
        value={this.state.value}
        onChange={(value) => this.setState({ value })}
      >
        <img src="path/to/thing.png" />
      </MapInteractionCSS>
    );
  }
}
```

### Controlled vs Uncontrolled
Similar to React's `<input />` component, you can either control the state of MapInteraction
yourself, or let it handle that for you. It is not recommended, however, that you change
this mode of control during the lifecycle of a component. Once you have started controlling
the state, keep controlling it under you unmount MapInteraction (likewise with uncontrolled).
If you pass `value` prop, we assume you are controlling the state via a `onChange` prop.

### Click and drag handlers on child elements
This component lets you decide how to respond to click/drag events on the children that you render inside of the map. To know if an element was clicked or dragged, you can attach onClick or onTouchEnd events and then check the `e.defaultPrevented` attribute. MapInteraction will set `defaultPrevented` to `true` if the touchend/mouseup event happened after a drag, and false if it was a click. See `index.stories.js` for an example.

## Prop Types for MapInteractionCSS (all optional)
MapInteraction doesn't require any props. It will control its own internal state, and pass values to its children. If you need to control the scale and translation then you can pass those values as props and listen to the onChange event to receive updates.
```js
{
  value: PropTypes.shape({
    // The scale applied to the dimensions of the contents. A scale of 1 means the
    // contents appear at actual size, greater than 1 is zoomed, and between 0 and 1 is shrunken.
    scale: PropTypes.number,
    // The distance in pixels to translate the contents by.
    translation: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),    
  }),

  defaultValue: PropTypes.shape({
    scale: PropTypes.number,
    translation: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
  }),

  // Stops user from being able to zoom, but will still adhere to props.scale
  disableZoom: PropTypes.bool,

  // Stops user from being able to pan. Note that translation can still be
  // changed via zooming, in order to keep the focal point beneath the cursor. This prop does not change the behavior of the `translation` prop.
  disablePan: PropTypes.bool,

  // Apply a limit to the translation in any direction in pixel values. The default is unbounded.
  translationBounds: PropTypes.shape({
    xMin: PropTypes.number, xMax: PropTypes.number, yMin: PropTypes.number, yMax: PropTypes.number
  }),

  // Called with an object { scale, translation }
  onChange: PropTypes.func,

  // The min and max of the scale of the zoom. Must be > 0.
  minScale: PropTypes.number,
  maxScale: PropTypes.number,

  // When 'showControls' is 'true', plus/minus buttons are rendered
  // that let the user control the zoom factor
  showControls: PropTypes.bool,

  // Content to render in each of the control buttons (only when 'showControls' is 'true')
  plusBtnContents: PropTypes.node,
  minusBtnContents: PropTypes.node,

  // Class applied to the controls wrapper (only when 'showControls' is 'true')
  controlsClass: PropTypes.string,

  // Class applied to the plus/minus buttons (only when 'showControls' is 'true')
  btnClass: PropTypes.string,

  // Classes applied to each button separately (only when 'showControls' is 'true')
  plusBtnClass: PropTypes.string,
  minusBtnClass: PropTypes.string,
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

## Development
Please feel free to file issues or put up a PR.
Note the node version in .nvmrc file.

```
$ yarn install
```

```
$ yarn test
```

```
$ yarn run storybook
```
