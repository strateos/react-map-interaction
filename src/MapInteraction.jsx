import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Controls from './Controls';

import { clamp, distance, midpoint, touchPt, touchDistance } from './geometry';
import makePassiveEventOption from './makePassiveEventOption';

// The amount that a value of a dimension will change given a new scale
const coordChange = (coordinate, scaleRatio) => {
  return (scaleRatio * coordinate) - coordinate;
};

const translationShape = PropTypes.shape({ x: PropTypes.number, y: PropTypes.number });

/*
  This contains logic for providing a map-like interaction to any DOM node.
  It allows a user to pinch, zoom, translate, etc, as they would an interactive map.
  It renders its children with the current state of the translation and does not do any scaling
  or translating on its own. This works on both desktop, and mobile.
*/
export class MapInteractionControlled extends Component {
  static get propTypes() {
    return {
      // The content that will be transformed
      children: PropTypes.func,

      // This is a controlled component
      value: PropTypes.shape({
        scale: PropTypes.number.isRequired,
        translation: translationShape.isRequired,
      }).isRequired,
      onChange: PropTypes.func.isRequired,

      disableZoom: PropTypes.bool,
      disablePan: PropTypes.bool,
      translationBounds: PropTypes.shape({
        xMin: PropTypes.number, xMax: PropTypes.number, yMin: PropTypes.number, yMax: PropTypes.number
      }),
      minScale: PropTypes.number,
      maxScale: PropTypes.number,
      showControls: PropTypes.bool,
      plusBtnContents: PropTypes.node,
      minusBtnContents: PropTypes.node,
      btnClass: PropTypes.string,
      plusBtnClass: PropTypes.string,
      minusBtnClass: PropTypes.string,
      controlsClass: PropTypes.string
    };
  }

  static get defaultProps() {
    return {
      minScale: 0.05,
      maxScale: 3,
      showControls: false,
      translationBounds: {},
      disableZoom: false,
      disablePan: false
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      shouldPreventTouchEndDefault: false
    };

    this.startPointerInfo = undefined;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);

    this.onMouseUp = this.onMouseUp.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    this.onWheel = this.onWheel.bind(this);
  }

  componentDidMount() {
    const passiveOption = makePassiveEventOption(false);

    this.getContainerNode().addEventListener('wheel', this.onWheel, passiveOption);

    /*
      Setup events for the gesture lifecycle: start, move, end touch
    */

    // start gesture
    this.getContainerNode().addEventListener('touchstart', this.onTouchStart, passiveOption);
    this.getContainerNode().addEventListener('mousedown', this.onMouseDown, passiveOption);

    // move gesture
    window.addEventListener('touchmove', this.onTouchMove, passiveOption);
    window.addEventListener('mousemove', this.onMouseMove, passiveOption);

    // end gesture
    const touchAndMouseEndOptions = { capture: true, ...passiveOption };
    window.addEventListener('touchend', this.onTouchEnd, touchAndMouseEndOptions);
    window.addEventListener('mouseup', this.onMouseUp, touchAndMouseEndOptions);

  }

  componentWillUnmount() {
    this.getContainerNode().removeEventListener('wheel', this.onWheel);

    // Remove touch events
    this.getContainerNode().removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);

    // Remove mouse events
    this.getContainerNode().removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  /*
    Event handlers

    All touch/mouse handlers preventDefault because we add
    both touch and mouse handlers in the same session to support devicse
    with both touch screen and mouse inputs. The browser may fire both
    a touch and mouse event for a *single* user action, so we have to ensure
    that only one handler is used by canceling the event in the first handler.

    https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent
  */

  onMouseDown(e) {
    e.preventDefault();
    this.setPointerState([e]);
  }

  onTouchStart(e) {
    e.preventDefault();
    this.setPointerState(e.touches);
  }

  onMouseUp(e) {
    this.setPointerState();
  }

  onTouchEnd(e) {
    this.setPointerState(e.touches);
  }

  onMouseMove(e) {
    if (!this.startPointerInfo || this.props.disablePan) {
      return;
    }
    e.preventDefault();
    this.onDrag(e);
  }

  onTouchMove(e) {
    if (!this.startPointerInfo) {
      return;
    }

    e.preventDefault();

    const { disablePan, disableZoom } = this.props;

    const isPinchAction = e.touches.length == 2 && this.startPointerInfo.pointers.length > 1;
    if (isPinchAction && !disableZoom) {
      this.scaleFromMultiTouch(e);
    } else if ((e.touches.length === 1) && this.startPointerInfo && !disablePan) {
      this.onDrag(e.touches[0]);
    }
  }

  // handles both touch and mouse drags
  onDrag(pointer) {
    const { translation, pointers } = this.startPointerInfo;
    const startPointer = pointers[0];
    const dragX = pointer.clientX - startPointer.clientX;
    const dragY = pointer.clientY - startPointer.clientY;
    const newTranslation = {
      x: translation.x + dragX,
      y: translation.y + dragY
    };

    const shouldPreventTouchEndDefault = Math.abs(dragX) > 1 || Math.abs(dragY) > 1;

    this.setState({
      shouldPreventTouchEndDefault
    }, () => {
      this.props.onChange({
        scale: this.props.value.scale,
        translation: this.clampTranslation(newTranslation)
      });
    });
  }

  onWheel(e) {
    if (this.props.disableZoom) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const scaleChange = 2 ** (e.deltaY * 0.002);

    const newScale = clamp(
      this.props.minScale,
      this.props.value.scale + (1 - scaleChange),
      this.props.maxScale
    );

    const mousePos = this.clientPosToTranslatedPos({ x: e.clientX, y: e.clientY });

    this.scaleFromPoint(newScale, mousePos);
  }

  setPointerState(pointers) {
    if (!pointers || pointers.length === 0) {
      this.startPointerInfo = undefined;
      return;
    }

    this.startPointerInfo = {
      pointers,
      scale: this.props.value.scale,
      translation: this.props.value.translation,
    }
  }

  clampTranslation(desiredTranslation, props = this.props) {
    const { x, y } = desiredTranslation;
    let { xMax, xMin, yMax, yMin } = props.translationBounds;
    xMin = xMin != undefined ? xMin : -Infinity;
    yMin = yMin != undefined ? yMin : -Infinity;
    xMax = xMax != undefined ? xMax : Infinity;
    yMax = yMax != undefined ? yMax : Infinity;

    return {
      x: clamp(xMin, x, xMax),
      y: clamp(yMin, y, yMax)
    };
  }

  translatedOrigin(translation = this.props.value.translation) {
    const clientOffset = this.getContainerBoundingClientRect();
    return {
      x: clientOffset.left + translation.x,
      y: clientOffset.top + translation.y
    };
  }

  // From a given screen point return it as a point
  // in the coordinate system of the given translation
  clientPosToTranslatedPos({ x, y }, translation = this.props.value.translation) {
    const origin = this.translatedOrigin(translation);
    return {
      x: x - origin.x,
      y: y - origin.y
    };
  }

  scaleFromPoint(newScale, focalPt) {
    const { translation, scale } = this.props.value;
    const scaleRatio = newScale / (scale != 0 ? scale : 1);

    const focalPtDelta = {
      x: coordChange(focalPt.x, scaleRatio),
      y: coordChange(focalPt.y, scaleRatio)
    };

    const newTranslation = {
      x: translation.x - focalPtDelta.x,
      y: translation.y - focalPtDelta.y
    };
    this.props.onChange({
      scale: newScale,
      translation: this.clampTranslation(newTranslation)
    })
  }

  // Given the start touches and new e.touches, scale and translate
  // such that the initial midpoint remains as the new midpoint. This is
  // to achieve the effect of keeping the content that was directly
  // in the middle of the two fingers as the focal point throughout the zoom.
  scaleFromMultiTouch(e) {
    const startTouches = this.startPointerInfo.pointers;
    const newTouches   = e.touches;

    // calculate new scale
    const dist0       = touchDistance(startTouches[0], startTouches[1]);
    const dist1       = touchDistance(newTouches[0], newTouches[1]);
    const scaleChange = dist1 / dist0;

    const startScale  = this.startPointerInfo.scale;
    const targetScale = startScale + ((scaleChange - 1) * startScale);
    const newScale    = clamp(this.props.minScale, targetScale, this.props.maxScale);

    // calculate mid points
    const startMidpoint = midpoint(touchPt(startTouches[0]), touchPt(startTouches[1]))
    const newMidPoint   = midpoint(touchPt(newTouches[0]), touchPt(newTouches[1]));

    // The amount we need to translate by in order for
    // the mid point to stay in the middle (before thinking about scaling factor)
    const dragDelta = {
      x: newMidPoint.x - startMidpoint.x,
      y: newMidPoint.y - startMidpoint.y
    };

    const scaleRatio = newScale / startScale;

    // The point originally in the middle of the fingers on the initial zoom start
    const focalPt = this.clientPosToTranslatedPos(startMidpoint, this.startPointerInfo.translation);

    // The amount that the middle point has changed from this scaling
    const focalPtDelta = {
      x: coordChange(focalPt.x, scaleRatio),
      y: coordChange(focalPt.y, scaleRatio)
    };

    // Translation is the original translation, plus the amount we dragged,
    // minus what the scaling will do to the focal point. Subtracting the
    // scaling factor keeps the midpoint in the middle of the touch points.
    const newTranslation = {
      x: this.startPointerInfo.translation.x - focalPtDelta.x + dragDelta.x,
      y: this.startPointerInfo.translation.y - focalPtDelta.y + dragDelta.y
    };

    this.props.onChange({
      scale: newScale,
      translation: this.clampTranslation(newTranslation)
    });
  }

  discreteScaleStepSize() {
    const { minScale, maxScale } = this.props;
    const delta = Math.abs(maxScale - minScale);
    return delta / 10;
  }

  // Scale using the center of the content as a focal point
  changeScale(delta) {
    const targetScale = this.props.value.scale + delta;
    const { minScale, maxScale } = this.props;
    const scale = clamp(minScale, targetScale, maxScale);

    const rect = this.getContainerBoundingClientRect();
    const x = rect.left + (rect.width / 2);
    const y = rect.top + (rect.height / 2);

    const focalPoint = this.clientPosToTranslatedPos({ x, y });
    this.scaleFromPoint(scale, focalPoint);
  }

  // Done like this so it is mockable
  getContainerNode() { return this.containerNode }
  getContainerBoundingClientRect() {
    return this.getContainerNode().getBoundingClientRect();
  }

  renderControls() {
    const step = this.discreteScaleStepSize();
    return (
      <Controls
        onClickPlus={() => this.changeScale(step)}
        onClickMinus={() => this.changeScale(-step)}
        plusBtnContents={this.props.plusBtnContents}
        minusBtnContents={this.props.minusBtnContents}
        btnClass={this.props.btnClass}
        plusBtnClass={this.props.plusBtnClass}
        minusBtnClass={this.props.minusBtnClass}
        controlsClass={this.props.controlsClass}
        scale={this.props.value.scale}
        minScale={this.props.minScale}
        maxScale={this.props.maxScale}
        disableZoom={this.props.disableZoom}
      />
    );
  }

  render() {
    const { showControls, children } = this.props;
    const scale = this.props.value.scale;
    // Defensively clamp the translation. This should not be necessary if we properly set state elsewhere.
    const translation = this.clampTranslation(this.props.value.translation);

    /*
      This is a little trick to allow the following ux: We want the parent of this
      component to decide if elements inside the map are clickable. Normally, you wouldn't
      want to trigger a click event when the user *drags* on an element (only if they click
      and then release w/o dragging at all). However we don't want to assume this
      behavior here, so we call `preventDefault` and then let the parent check
      `e.defaultPrevented`. That value being true means that we are signalling that
      a drag event ended, not a click.
    */
    const handleEventCapture = (e) => {
      if (this.state.shouldPreventTouchEndDefault) {
        e.preventDefault();
        this.setState({ shouldPreventTouchEndDefault: false });
      }
    }

    return (
      <div
        ref={(node) => {
          this.containerNode = node;
        }}
        style={{
          height: '100%',
          width: '100%',
          position: 'relative', // for absolutely positioned children
          touchAction: 'none'
        }}
        onClickCapture={handleEventCapture}
        onTouchEndCapture={handleEventCapture}
      >
        {(children || undefined) && children({ translation, scale })}
        {(showControls || undefined) && this.renderControls()}
      </div>
    );
  }
}

/*
  Main entry point component.
  Determines if it's parent is controlling (eg it manages state) or leaving us uncontrolled
  (eg we manage our own internal state)
*/
class MapInteractionController extends Component {
  static get propTypes() {
    return {
      children: PropTypes.func,
      value: PropTypes.shape({
        scale: PropTypes.number.isRequired,
        translation: translationShape.isRequired,
      }),
      defaultValue: PropTypes.shape({
        scale: PropTypes.number.isRequired,
        translation: translationShape.isRequired,
      }),
      disableZoom: PropTypes.bool,
      disablePan: PropTypes.bool,
      onChange: PropTypes.func,
      translationBounds: PropTypes.shape({
        xMin: PropTypes.number, xMax: PropTypes.number, yMin: PropTypes.number, yMax: PropTypes.number
      }),
      minScale: PropTypes.number,
      maxScale: PropTypes.number,
      showControls: PropTypes.bool,
      plusBtnContents: PropTypes.node,
      minusBtnContents: PropTypes.node,
      btnClass: PropTypes.string,
      plusBtnClass: PropTypes.string,
      minusBtnClass: PropTypes.string,
      controlsClass: PropTypes.string
    };
  }

  constructor(props) {
    super(props);

    const controlled = MapInteractionController.isControlled(props);
    if (controlled) {
      this.state = {
        lastKnownValueFromProps: props.value
      };
    } else {
      // Set the necessary state for controlling map interaction ourselves
      this.state = {
        value: props.defaultValue || {
          scale: 1,
          translation: { x: 0, y: 0 }
        },
        lastKnownValueFromProps: undefined
      };
    }
  }

  /*
    Handle the parent switchg form controlled to uncontrolled or vice versa.
    This is at most a best-effort attempt. It is not gauranteed by our API
    but it will do its best to maintain the state such that if the parent
    accidentally switches between controlled/uncontrolled there won't be
    any jankiness or jumpiness.

    This tries to mimick how the React <input /> component behaves.
  */
  static getDerivedStateFromProps(props, state) {
    const nowControlled = MapInteractionController.isControlled(props);
    const wasControlled = state.lastKnownValueFromProps && MapInteractionController.isControlled({ value: state.lastKnownValueFromProps })

    /*
      State transitions:
        uncontrolled --> controlled   (unset internal state, set last props from parent)
        controlled   --> uncontrolled (set internal state to last props from parent)
        controlled   --> controlled   (update last props from parent)
        uncontrolled --> uncontrolled (do nothing)

      Note that the second two (no change in control) will also happen on the
      initial render because we set lastKnownValueFromProps in the constructor.
    */
    if (!wasControlled && nowControlled) {
      return {
        value: undefined,
        lastKnownValueFromProps: props.value
      };
    } else if (wasControlled && !nowControlled) {
      return {
        value: state.lastKnownValueFromProps,
        lastKnownValueFromProps: undefined
      };
    } else if (wasControlled && nowControlled) {
      return { lastKnownValueFromProps: props.value };
    } else if (!wasControlled && !nowControlled) {
      return null;
    }
  }

  static isControlled(props) {
    // Similar to React's <input /> API, setting a value declares
    // that you want to control this component.
    return props.value != undefined;
  }

  // The subset of this component's props that need to be passed
  // down to the core RMI component
  innerProps() {
    const { value, defaultValue, onChange, ...innerProps } = this.props;
    return innerProps;
  }

  getValue() {
    const controlled = MapInteractionController.isControlled(this.props);
    return controlled ? this.props.value : this.state.value;
  }

  render() {
    const { onChange, children } = this.props;
    const controlled = MapInteractionController.isControlled(this.props);
    const value = controlled ? this.props.value : this.state.value;
    return (
      <MapInteractionControlled
        onChange={(value) => {
          controlled ? onChange(value) : this.setState({ value });
        }}
        value={value}
        {...this.innerProps()}
      >
       {children}
      </MapInteractionControlled>
    );
  }
}

export default MapInteractionController;
