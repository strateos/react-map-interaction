import React, { Component } from 'react';
import PropTypes from 'prop-types';

const clamp = (min, value, max) =>
  Math.max(min, Math.min(value, max));

function isTouchDevice() {
  return (('ontouchstart' in window) ||
    (navigator.MaxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
}

function eventNames() {
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
      initialX: PropTypes.number,
      initialY: PropTypes.number,
      minScale: PropTypes.number,
      maxScale: PropTypes.number,
      showControls: PropTypes.bool,
      plusBtnContents: PropTypes.node,
      minusBtnContents: PropTypes.node,
      btnClass: PropTypes.string
    };
  }

  static get defaultProps() {
    return {
      initialX: 0,
      initialY: 0,
      minScale: 0.05,
      maxScale: 3,
      showControls: false
    };
  }


  constructor(props) {
    super(props);
    this.state = {
      // TODO rename mouseDownCoords since this supports touch and mouse events
      // TODO remove mouseDownCoords from state
      mouseDownCoords: undefined,
      scale: 1,
      translation: {
        x: -props.initialX,
        y: -props.initialY
      }
    };

    this.startTouchInfo = undefined;

    this.onDown = this.onDown.bind(this);
    this.onTouchDown = this.onTouchDown.bind(this);

    this.onMove = this.onMove.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);

    this.onUp = this.onUp.bind(this);
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

  componentWillUnmount() {
    const events = eventNames();
    const handlers = this.handlers();

    this.containerNode.removeEventListener(events.down, handlers.down);
    window.removeEventListener(events.move, handlers.move);
    window.removeEventListener(events.up, handlers.up);

  }

  onDown(e) {
    this.setState({
      mouseDownCoords: {
        x: e.clientX,
        y: e.clientY,
        translation: this.state.translation
      }
    });
  }

  onTouchDown(e) {
    e.preventDefault();
    e.stopPropagation();
    this.onDown(e.touches[0]);

    if (e.touches.length === 2) {
      this.startTouchInfo = {
        scale: this.state.scale,
        translation: this.state.translation,
        touches: e.touches
      }
      this.setState({ mouseDownCoords: undefined });
    }
  }

  onUp() {
    const coords = this.state.mouseDownCoords;
    if (coords) {
      this.setState({ mouseDownCoords: undefined });
    }
  }

  onTouchEnd(e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.touches.length < 2) {
      this.startTouchInfo = undefined;
    }
  }

  onMove(e) {
    const { mouseDownCoords } = this.state;
    if (!mouseDownCoords) {
      return;
    }

    const { x, y, translation } = mouseDownCoords;

    this.setState({
      translation: {
        x: translation.x + (e.clientX - x),
        y: translation.y + (e.clientY - y)
      }
    });
  }

  onTouchMove(e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.touches.length == 2) {
      this.handleMultiTouchMove(e);
    } else if (e.touches.length === 1) {
      if (this.state.mouseDownCoords) {
        this.onMove(e.touches[0]);
      }
    }
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

  handleMultiTouchMove(e) {
    this.scaleFromMultiTouch(e);
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
      down: isTouch ? this.onTouchDown : this.onDown,
      move: isTouch ? this.onTouchMove : this.onMove,
      up:   isTouch ? this.onTouchEnd : this.onUp
    };
  }

  scaleFromPoint(newScale, focalPt) {
    const { translation, scale } = this.state;
    const scaleRatio = newScale / scale;

    const focalPtDelta = {
      x: coordChange(focalPt.x, scaleRatio),
      y: coordChange(focalPt.y, scaleRatio)
    };

    const newTranslation = {
      x: translation.x - focalPtDelta.x,
      y: translation.y - focalPtDelta.y
    };

    this.setState({ scale: newScale, translation: newTranslation });
  }

  scaleFromMultiTouch(e) {
    const startTouches = this.startTouchInfo.touches;
    const newTouches   = e.touches;

    // calculate new scale
    const dist0       = touchDistance(startTouches[0], startTouches[1]);
    const dist1       = touchDistance(newTouches[0], newTouches[1]);
    const scaleChange = dist1 / dist0;
    const targetScale = this.startTouchInfo.scale + (scaleChange - 1);
    const newScale    = clamp(this.props.minScale, targetScale, this.props.maxScale);

    // calculate mid points
    const newMidPoint   = midpoint(touchPt(newTouches[0]), touchPt(newTouches[1]));
    const startMidpoint = midpoint(touchPt(startTouches[0]), touchPt(startTouches[1]))

    const dragDelta = {
      x: newMidPoint.x - startMidpoint.x,
      y: newMidPoint.y - startMidpoint.y
    };

    const scaleRatio = newScale / this.startTouchInfo.scale;

    const focalPt = this.clientPosToTranslatedPos(startMidpoint, this.startTouchInfo.translation);
    const focalPtDelta = {
      x: coordChange(focalPt.x, scaleRatio),
      y: coordChange(focalPt.y, scaleRatio)
    };

    const newTranslation = {
      x: this.startTouchInfo.translation.x - focalPtDelta.x + dragDelta.x,
      y: this.startTouchInfo.translation.y - focalPtDelta.y + dragDelta.y
    };

    this.setState({ scale: newScale, translation: newTranslation });
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
        scale={this.state.scale}
        minScale={this.props.minScale}
        maxScale={this.props.maxScale}
      />
    );
  }

  render() {
    const { showControls, children } = this.props;
    const { scale, translation } = this.state;

    return (
      <div
        ref={(node) => { this.containerNode = node; }}
        onWheel={this.onWheel}
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
  render() {
    const {
      onClickPlus,
      onClickMinus,
      plusBtnContents,
      minusBtnContents,
      btnClass,
      scale,
      minScale,
      maxScale
    } = this.props;

    return (
      <div style={{ position: 'absolute', right: 10, top: 10 }}>
        <div>
          <button
            ref={(node) => { this.plusNode = node; }}
            onClick={() => {
              this.plusNode.blur();
              onClickPlus();
            }}
            className={btnClass}
            disabled={scale >= maxScale}
          >
            {plusBtnContents}
          </button>
        </div>
        <div>
          <button
            ref={(node) => { this.minusNode = node; }}
            onClick={() => {
              this.minusNode.blur();
              onClickMinus();
            }}
            className={btnClass}
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
