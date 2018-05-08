import React, { Component } from 'react';
import PropTypes from 'prop-types';

const clamp = (min, value, max) => Math.max(min, Math.min(value, max));

const isTouchDevice = () => {
  return (('ontouchstart' in window) ||
    (navigator.MaxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
}

const eventNames = () => {
  const isTouch = isTouchDevice();

  return {
    down: isTouch ? 'touchstart' : 'mousedown',
    move: isTouch ? 'touchmove' : 'mousemove',
    up:   isTouch ? 'touchend' : 'mouseup'
  };
}

const distance = (p1, p2) => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(Math.pow(dx, 2), Math.pow(dy, 2));
}

const midpoint = (p1, p2) => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
}

const touchPt = (touch) => {
  return { x: touch.clientX, y: touch.clientY };
};

const touchDistance = (t0, t1) => {
  const p0 = touchPt(t0);
  const p1 = touchPt(t1);
  return distance(p0, p1);
};

const coordChange = (coordinate, scaleRatio) => {
  return (scaleRatio * coordinate) - coordinate;
};

/*
  This contains logic for providing a map-like interaction to any DOM node.
  It allows a user to pinch, zoom, translate, etc, as they would an interactive map.
  It renders its children with the current state of the translation and  does not do any  scaling
  or translating on its own. This works on both desktop, and mobile.
*/
class MapInteraction extends Component {
  static get propTypes() {
    return {
      children: PropTypes.func,
      scale: PropTypes.number,
      translation: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
      defaultScale: PropTypes.number,
      defaultTranslation: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
      onChange: PropTypes.func,
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
      showControls: false
    };
  }

  constructor(props) {
    super(props);
    const { scale, defaultScale, translation, defaultTranslation, minScale, maxScale } = props;

    let desiredScale;
    if (scale != undefined) {
      desiredScale = scale;
    } else if (defaultScale != undefined) {
      desiredScale = defaultScale;
    } else {
      desiredScale = 1;
    }

    this.state = {
      scale: clamp(minScale, desiredScale, maxScale),
      translation: translation || defaultTranslation || { x: 0, y: 0 },
      stopClickPropagation: false
    };

    this.startPointerInfo = undefined;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onTouchDown = this.onTouchDown.bind(this);

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);

    this.onMouseUp = this.onMouseUp.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    this.onWheel = this.onWheel.bind(this);
  }

  componentDidMount() {
    const events = eventNames();
    const handlers = this.handlers();

    this.containerNode.addEventListener(events.down, handlers.down);
    window.addEventListener(events.move, handlers.move);
    window.addEventListener(events.up, handlers.up);
  }

  componentWillReceiveProps(newProps) {
    const scale = (newProps.scale != undefined) ? newProps.scale : this.state.scale;
    const translation = newProps.translation || this.state.translation;

    // if parent has overridden state then abort current user interaction
    if (
      translation.x != this.state.translation.x ||
      translation.y != this.state.translation.y ||
      scale != this.state.scale
    ) {
      this.setPointerState();
    }

    this.setState({
      scale: clamp(newProps.minScale, scale, newProps.maxScale),
      translation
    });
  }

  componentWillUnmount() {
    const events = eventNames();
    const handlers = this.handlers();

    this.containerNode.removeEventListener(events.down, handlers.down);
    window.removeEventListener(events.move, handlers.move);
    window.removeEventListener(events.up, handlers.up);
  }

  updateParent() {
    if (!this.props.onChange) {
      return;
    }
    const { scale, translation } = this.state;
    this.props.onChange({ scale, translation });
  }

  onMouseDown(e) {
    this.setPointerState([e]);
  }

  onTouchDown(e) {
    e.preventDefault();
    this.setPointerState(e.touches);
  }

  onMouseUp() {
    this.setPointerState();
  }

  onTouchEnd(e) {
    this.setPointerState(e.touches);
  }

  onMouseMove(e) {
    if (!this.startPointerInfo) {
      return;
    }
    this.onDrag(e);
  }

  onTouchMove(e) {
    e.preventDefault();

    if (!this.startPointerInfo) {
      return;
    }

    if (e.touches.length == 2 && this.startPointerInfo.pointers.length > 1) {
      this.scaleFromMultiTouch(e);
    } else if (e.touches.length === 1 && this.startPointerInfo) {
      this.onDrag(e.touches[0]);
    }
  }

  // handles both touch and mouse drags
  onDrag(pointer) {
    const { translation, pointers } = this.startPointerInfo;
    const startPointer = pointers[0];
    const dragX = pointer.clientX - startPointer.clientX;
    const dragY = pointer.clientY - startPointer.clientY;

    this.setState({
      translation: {
        x: translation.x + dragX,
        y: translation.y + dragY
      },
      stopClickPropagation: Boolean(Math.abs(dragX) + Math.abs(dragY) > 2)
    }, () => this.updateParent());
  }

  onWheel(e) {
    e.preventDefault();
    e.stopPropagation();

    const scaleChange = 2 ** (e.deltaY * 0.002);

    const newScale = clamp(
      this.props.minScale,
      this.state.scale + (1 - scaleChange),
      this.props.maxScale
    );

    const mousePos = this.clientPosToTranslatedPos({ x: e.clientX, y: e.clientY });

    this.scaleFromPoint(newScale, mousePos);
  }

  setPointerState(pointers) {
    if (!pointers) {
      this.startPointerInfo = undefined;
      return;
    }

    this.startPointerInfo = {
      pointers,
      scale: this.state.scale,
      translation: this.state.translation,
    }
  }

  translatedOrigin(translation = this.state.translation) {
    const clientOffset = this.containerNode.getBoundingClientRect();
    return {
      x: clientOffset.left + translation.x,
      y: clientOffset.top + translation.y
    };
  }

  clientPosToTranslatedPos({ x, y }, translation = this.state.translation) {
    const origin = this.translatedOrigin(translation);
    return {
      x: x - origin.x,
      y: y - origin.y
    };
  }

  handlers() {
    const isTouch = isTouchDevice();

    return {
      down: isTouch ? this.onTouchDown : this.onMouseDown,
      move: isTouch ? this.onTouchMove : this.onMouseMove,
      up:   isTouch ? this.onTouchEnd : this.onMouseUp
    };
  }

  scaleFromPoint(newScale, focalPt) {
    const { translation, scale } = this.state;
    const scaleRatio = newScale / (scale != 0 ? scale : 1);

    const focalPtDelta = {
      x: coordChange(focalPt.x, scaleRatio),
      y: coordChange(focalPt.y, scaleRatio)
    };

    const newTranslation = {
      x: translation.x - focalPtDelta.x,
      y: translation.y - focalPtDelta.y
    };

    this.setState({
      scale: newScale,
      translation: newTranslation
    }, () => this.updateParent());
  }

  scaleFromMultiTouch(e) {
    const startTouches = this.startPointerInfo.pointers;
    const newTouches   = e.touches;

    // calculate new scale
    const dist0       = touchDistance(startTouches[0], startTouches[1]);
    const dist1       = touchDistance(newTouches[0], newTouches[1]);
    const scaleChange = dist1 / dist0;
    const targetScale = this.startPointerInfo.scale + (scaleChange - 1);
    const newScale    = clamp(this.props.minScale, targetScale, this.props.maxScale);

    // calculate mid points
    const newMidPoint   = midpoint(touchPt(newTouches[0]), touchPt(newTouches[1]));
    const startMidpoint = midpoint(touchPt(startTouches[0]), touchPt(startTouches[1]))

    const dragDelta = {
      x: newMidPoint.x - startMidpoint.x,
      y: newMidPoint.y - startMidpoint.y
    };

    const scaleRatio = newScale / this.startPointerInfo.scale;

    const focalPt = this.clientPosToTranslatedPos(startMidpoint, this.startPointerInfo.translation);
    const focalPtDelta = {
      x: coordChange(focalPt.x, scaleRatio),
      y: coordChange(focalPt.y, scaleRatio)
    };

    const newTranslation = {
      x: this.startPointerInfo.translation.x - focalPtDelta.x + dragDelta.x,
      y: this.startPointerInfo.translation.y - focalPtDelta.y + dragDelta.y
    };

    this.setState({
      scale: newScale,
      translation: newTranslation
    }, () => this.updateParent());
  }

  discreteScaleStepSize() {
    const { minScale, maxScale } = this.props;
    const delta = Math.abs(maxScale - minScale);
    return delta / 10;
  }

  changeScale(delta) {
    const targetScale = this.state.scale + delta;
    const { minScale, maxScale } = this.props;
    const scale = clamp(minScale, targetScale, maxScale);

    const rect = this.containerNode.getBoundingClientRect();
    const x = rect.left + (rect.width / 2);
    const y = rect.top + (rect.height / 2);

    const focalPoint = this.clientPosToTranslatedPos({ x, y });
    this.scaleFromPoint(scale, focalPoint);
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
        scale={this.state.scale}
        minScale={this.props.minScale}
        maxScale={this.props.maxScale}
      />
    );
  }

  render() {
    const { showControls, children } = this.props;
    const { scale, translation } = this.state;
    const touchEndHandler = (e) => {
      if (this.state.stopClickPropagation) {
        e.stopPropagation();
        this.setState({ stopClickPropagation: false });
      }
    }
    return (
      <div
        ref={(node) => { this.containerNode = node; }}
        onWheel={this.onWheel}
        style={{
          height: '100%',
          width: '100%',
          position: 'relative', // for absolutely positioned children
        }}
        onClickCapture={touchEndHandler}
        onTouchEndCapture={touchEndHandler}
      >
        {(children || undefined) && children({ translation, scale })}
        {(showControls || undefined) && this.renderControls()}
      </div>
    );
  }
}

/*
  This component provides a map like interaction to any content that you place in it. It will let
  the user zoom and pan the children by scaling and translating props.children using css.
*/
const MapInteractionCSS = (props) => {
  return (
    <MapInteraction {...props}>
      {
        ({ translation, scale }) => {
          // Translate first and then scale.  Otherwise, the scale would affect the translation.
          const transform = `translate(${translation.x}px, ${translation.y}px) scale(${scale})`;
          return (
            <div
              style={{
                height: '100%',
                width: '100%',
                position: 'relative', // for absolutely positioned children
                overflow: 'hidden',
                touchAction: 'none', // Not supported in Safari :(
                msTouchAction: 'none',
                cursor: 'all-scroll',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
            >
              <div
                style={{
                  transform: transform,
                  transformOrigin: '0 0 '
                }}
              >
                {props.children}
              </div>
            </div>
          );
        }
      }
    </MapInteraction>
  );
};

class Controls extends Component {
  componentDidMount() {
    this.setPointerHandlers()
  }

  setPointerHandlers() {
    const { onClickPlus, onClickMinus } = this.props;

    const plusHandler = () => {
      this.plusNode.blur();
      onClickPlus();
    };

    const minusHandler = () => {
      this.minusNode.blur();
      onClickMinus();
    };

    const eventName = isTouchDevice() ? 'touchstart' : 'click';

    this.plusNode.addEventListener(eventName, plusHandler);
    this.minusNode.addEventListener(eventName, minusHandler);
  }

  render() {
    const {
      plusBtnContents,
      minusBtnContents,
      btnClass,
      plusBtnClass,
      minusBtnClass,
      controlsClass,
      scale,
      minScale,
      maxScale
    } = this.props;

    const btnStyle = btnClass ? undefined : { width: 30, paddingTop: 5, marginBottom: 5 };
    const controlsStyle = controlsClass ? undefined : { position: 'absolute', right: 10, top: 10 };

    return (
      <div style={controlsStyle} className={controlsClass}>
        <div>
          <button
            ref={(node) => { this.plusNode = node; }}
            className={`${btnClass} ${plusBtnClass}`}
            style={btnStyle}
            disabled={scale >= maxScale}
          >
            {plusBtnContents}
          </button>
        </div>
        <div>
          <button
            ref={(node) => { this.minusNode = node; }}
            className={`${btnClass} ${minusBtnClass}`}
            style={btnStyle}
            disabled={scale <= minScale}
          >
            {minusBtnContents}
          </button>
        </div>
      </div>
    );
  }
}

Controls.propTypes = {
  onClickPlus: PropTypes.func.isRequired,
  onClickMinus: PropTypes.func.isRequired,
  plusBtnContents: PropTypes.node,
  minusBtnContents: PropTypes.node,
  btnClass: PropTypes.string,
  plusBtnClass: PropTypes.string,
  minusBtnClass: PropTypes.string,
  controlsClass: PropTypes.string,
  scale: PropTypes.number,
  minScale: PropTypes.number,
  maxScale: PropTypes.number
};

Controls.defaultProps = {
  plusBtnContents: '+',
  minusBtnContents: '-'
};

export { MapInteractionCSS, MapInteraction };
export default MapInteraction;
