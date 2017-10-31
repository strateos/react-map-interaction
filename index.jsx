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

/*
  This component provides a map like interaction to any content that you place in it. It will let
  the user zoom and pan the children by scaling and translating props.children using css.
*/
class MapInteraction extends Component {
  static get propTypes() {
    return {
      initialX: PropTypes.number,
      initialY: PropTypes.number,
      minScale: PropTypes.number,
      maxScale: PropTypes.number,
      bkgColor: PropTypes.string,
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
      bkgColor: undefined,
      showControls: false
    };
  }


  constructor(props) {
    super(props);
    this.state = {
      // todo rename since this supports touch and mouse events
      mouseDownCoords: undefined,
      scale: 1,
      translation: {
        x: -props.initialX,
        y: -props.initialY
      }
    };

    this.onDown = this.onDown.bind(this);
    this.onTouchDown = this.onTouchDown.bind(this);

    this.onMove = this.onMove.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);

    this.onUp = this.onUp.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    this.onWheel = this.onWheel.bind(this);
  }

  // Setup touch/mouse events.
  // NOTE: Multi touch is not yet suppported.
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
    this.onUp();
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
    this.onMove(e.touches[0]);
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

    this.scale(newScale, mousePos);
  }

  clientPosToTranslatedPos({ x, y }) {
    const clientOffset = this.containerNode.getBoundingClientRect();
    const origin = {
      x: clientOffset.left + this.state.translation.x,
      y: clientOffset.top + this.state.translation.y
    };

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

  /*
    When the user zooms on a point we want that point to remain beneath
    the users mouse as the scaling occurs. To do this we translate the element by the inverse
    of the amount that the point would have changed given the new scale.

    scale: int
    focalPoint: {x, y} position relative to the translated origin
  */
  scale(scale, focalPoint) {
    const scaleRatio = scale / this.state.scale;

    const coordChange = coordinate => (scaleRatio * coordinate) - coordinate;

    const changeInFocalPoint = {
      x: coordChange(focalPoint.x),
      y: coordChange(focalPoint.y)
    };

    const translation = {
      x: this.state.translation.x - changeInFocalPoint.x,
      y: this.state.translation.y - changeInFocalPoint.y
    };

    this.setState({ scale, translation });
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
    this.scale(scale, focalPoint);
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
    const { scale, translation } = this.state;

    // Translate first and then scale.  Otherwise, the scale would affect the translation.
    const transform = `translate(${translation.x}px, ${translation.y}px) scale(${scale})`;

    const showControls = this.props.showControls || undefined;

    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <div
        ref={(node) => { this.containerNode = node; }}
        onWheel={this.onWheel}
        style={{
          height: '100%',
          width: '100%',
          position: 'relative', // for absolutely positioned children
          backgroundColor: this.props.bkgColor,
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
          {this.props.children}
        </div>
        {showControls && this.renderControls()}
      </div>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions */
  }
}

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

export default MapInteraction;
