import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Controls extends Component {
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
      maxScale,
      onClickPlus,
      onClickMinus,
      disableZoom
    } = this.props;

    const btnStyle = { width: 30, paddingTop: 5, marginBottom: 5 };
    const controlsStyle = controlsClass ? undefined : { position: 'absolute', right: 10, top: 10 };

    function plusHandler(e) {
      e.preventDefault();
      e.target.blur();
      if (disableZoom) return;
      onClickPlus();
    }

    function minusHandler(e) {
      e.preventDefault();
      e.target.blur();
      if (disableZoom) return;
      onClickMinus();
    }

    return (
      <div style={controlsStyle} className={controlsClass}>
        <div>
          <button
            ref={(node) => { this.plusNode = node; }}
            onClick={plusHandler}
            onTouchEnd={plusHandler}
            className={[
              btnClass ? btnClass : '',
              plusBtnClass ? plusBtnClass : '',
            ].join(' ')}
            type="button"
            style={(btnClass || plusBtnClass) ? undefined : btnStyle}
            disabled={disableZoom || scale >= maxScale}
          >
            {plusBtnContents}
          </button>
        </div>
        <div>
          <button
            ref={(node) => { this.minusNode = node; }}
            onClick={minusHandler}
            onTouchEnd={minusHandler}
            className={[
              btnClass ? btnClass : '',
              minusBtnClass ? minusBtnClass : '',
            ].join(' ')}
            type="button"
            style={(btnClass || minusBtnClass) ? undefined : btnStyle}
            disabled={disableZoom || scale <= minScale}
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
  maxScale: PropTypes.number,
  disableZoom: PropTypes.bool
};

Controls.defaultProps = {
  plusBtnContents: '+',
  minusBtnContents: '-',
  disableZoom: false
};

export default Controls;
