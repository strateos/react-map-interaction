(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("prop-types"), require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["prop-types", "React"], factory);
	else if(typeof exports === 'object')
		exports["ReactMapInteraction"] = factory(require("prop-types"), require("react"));
	else
		root["ReactMapInteraction"] = factory(root["PropTypes"], root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE__0__, __WEBPACK_EXTERNAL_MODULE__1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__1__;

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external {"commonjs":"react","commonjs2":"react","amd":"React","root":"React"}
var external_commonjs_react_commonjs2_react_amd_React_root_React_ = __webpack_require__(1);
var external_commonjs_react_commonjs2_react_amd_React_root_React_default = /*#__PURE__*/__webpack_require__.n(external_commonjs_react_commonjs2_react_amd_React_root_React_);

// EXTERNAL MODULE: external {"commonjs":"prop-types","commonjs2":"prop-types","commonj2s":"prop-types","amd":"prop-types","root":"PropTypes"}
var external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_ = __webpack_require__(0);
var external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default = /*#__PURE__*/__webpack_require__.n(external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_);

// CONCATENATED MODULE: ./src/Controls.jsx
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var Controls_Controls =
/*#__PURE__*/
function (_Component) {
  _inherits(Controls, _Component);

  function Controls() {
    _classCallCheck(this, Controls);

    return _possibleConstructorReturn(this, _getPrototypeOf(Controls).apply(this, arguments));
  }

  _createClass(Controls, [{
    key: "render",
    value: function render() {
      var _this = this;

      var _this$props = this.props,
          plusBtnContents = _this$props.plusBtnContents,
          minusBtnContents = _this$props.minusBtnContents,
          btnClass = _this$props.btnClass,
          plusBtnClass = _this$props.plusBtnClass,
          minusBtnClass = _this$props.minusBtnClass,
          controlsClass = _this$props.controlsClass,
          scale = _this$props.scale,
          minScale = _this$props.minScale,
          maxScale = _this$props.maxScale,
          onClickPlus = _this$props.onClickPlus,
          onClickMinus = _this$props.onClickMinus,
          disableZoom = _this$props.disableZoom;
      var btnStyle = {
        width: 30,
        paddingTop: 5,
        marginBottom: 5
      };
      var controlsStyle = controlsClass ? undefined : {
        position: 'absolute',
        right: 10,
        top: 10
      };

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

      return external_commonjs_react_commonjs2_react_amd_React_root_React_default.a.createElement("div", {
        style: controlsStyle,
        className: controlsClass
      }, external_commonjs_react_commonjs2_react_amd_React_root_React_default.a.createElement("div", null, external_commonjs_react_commonjs2_react_amd_React_root_React_default.a.createElement("button", {
        ref: function ref(node) {
          _this.plusNode = node;
        },
        onClick: plusHandler,
        onTouchEnd: plusHandler,
        className: [btnClass ? btnClass : '', plusBtnClass ? plusBtnClass : ''].join(' '),
        type: "button",
        style: btnClass || plusBtnClass ? undefined : btnStyle,
        disabled: disableZoom || scale >= maxScale
      }, plusBtnContents)), external_commonjs_react_commonjs2_react_amd_React_root_React_default.a.createElement("div", null, external_commonjs_react_commonjs2_react_amd_React_root_React_default.a.createElement("button", {
        ref: function ref(node) {
          _this.minusNode = node;
        },
        onClick: minusHandler,
        onTouchEnd: minusHandler,
        className: [btnClass ? btnClass : '', minusBtnClass ? minusBtnClass : ''].join(' '),
        type: "button",
        style: btnClass || minusBtnClass ? undefined : btnStyle,
        disabled: disableZoom || scale <= minScale
      }, minusBtnContents)));
    }
  }]);

  return Controls;
}(external_commonjs_react_commonjs2_react_amd_React_root_React_["Component"]);

Controls_Controls.propTypes = {
  onClickPlus: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.func.isRequired,
  onClickMinus: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.func.isRequired,
  plusBtnContents: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.node,
  minusBtnContents: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.node,
  btnClass: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.string,
  plusBtnClass: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.string,
  minusBtnClass: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.string,
  controlsClass: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.string,
  scale: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.number,
  minScale: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.number,
  maxScale: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.number,
  disableZoom: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.bool
};
Controls_Controls.defaultProps = {
  plusBtnContents: '+',
  minusBtnContents: '-',
  disableZoom: false
};
/* harmony default export */ var src_Controls = (Controls_Controls);
// CONCATENATED MODULE: ./src/geometry.js
function clamp(min, value, max) {
  return Math.max(min, Math.min(value, max));
}

function distance(p1, p2) {
  var dx = p1.x - p2.x;
  var dy = p1.y - p2.y;
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

function midpoint(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
}

function touchPt(touch) {
  return {
    x: touch.clientX,
    y: touch.clientY
  };
}

function touchDistance(t0, t1) {
  var p0 = touchPt(t0);
  var p1 = touchPt(t1);
  return distance(p0, p1);
}


// CONCATENATED MODULE: ./src/makePassiveEventOption.js
// We want to make event listeners non-passive, and to do so have to check
// that browsers support EventListenerOptions in the first place.
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
var passiveSupported = false;

try {
  var options = {
    get passive() {
      passiveSupported = true;
    }

  };
  window.addEventListener("test", options, options);
  window.removeEventListener("test", options, options);
} catch (_unused) {
  passiveSupported = false;
}

function makePassiveEventOption(passive) {
  return passiveSupported ? {
    passive: passive
  } : passive;
}

/* harmony default export */ var src_makePassiveEventOption = (makePassiveEventOption);
// CONCATENATED MODULE: ./src/MapInteraction.jsx
function MapInteraction_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { MapInteraction_typeof = function _typeof(obj) { return typeof obj; }; } else { MapInteraction_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return MapInteraction_typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function MapInteraction_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function MapInteraction_possibleConstructorReturn(self, call) { if (call && (MapInteraction_typeof(call) === "object" || typeof call === "function")) { return call; } return MapInteraction_assertThisInitialized(self); }

function MapInteraction_getPrototypeOf(o) { MapInteraction_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return MapInteraction_getPrototypeOf(o); }

function MapInteraction_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function MapInteraction_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function MapInteraction_createClass(Constructor, protoProps, staticProps) { if (protoProps) MapInteraction_defineProperties(Constructor.prototype, protoProps); if (staticProps) MapInteraction_defineProperties(Constructor, staticProps); return Constructor; }

function MapInteraction_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) MapInteraction_setPrototypeOf(subClass, superClass); }

function MapInteraction_setPrototypeOf(o, p) { MapInteraction_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return MapInteraction_setPrototypeOf(o, p); }





 // The amount that a value of a dimension will change given a new scale

var coordChange = function coordChange(coordinate, scaleRatio) {
  return scaleRatio * coordinate - coordinate;
};

var translationShape = external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.shape({
  x: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.number,
  y: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.number
});
/*
  This contains logic for providing a map-like interaction to any DOM node.
  It allows a user to pinch, zoom, translate, etc, as they would an interactive map.
  It renders its children with the current state of the translation and does not do any scaling
  or translating on its own. This works on both desktop, and mobile.
*/

var MapInteraction_MapInteraction =
/*#__PURE__*/
function (_Component) {
  MapInteraction_inherits(MapInteraction, _Component);

  MapInteraction_createClass(MapInteraction, null, [{
    key: "propTypes",
    get: function get() {
      return {
        children: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.func,
        scale: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.number,
        translation: translationShape,
        defaultScale: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.number,
        defaultTranslation: translationShape,
        disableZoom: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.bool,
        disablePan: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.bool,
        onChange: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.func,
        translationBounds: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.shape({
          xMin: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.number,
          xMax: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.number,
          yMin: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.number,
          yMax: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.number
        }),
        minScale: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.number,
        maxScale: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.number,
        showControls: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.bool,
        plusBtnContents: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.node,
        minusBtnContents: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.node,
        btnClass: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.string,
        plusBtnClass: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.string,
        minusBtnClass: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.string,
        controlsClass: external_commonjs_prop_types_commonjs2_prop_types_commonj2s_prop_types_amd_prop_types_root_PropTypes_default.a.string
      };
    }
  }, {
    key: "defaultProps",
    get: function get() {
      return {
        minScale: 0.05,
        maxScale: 3,
        showControls: false,
        translationBounds: {},
        disableZoom: false,
        disablePan: false
      };
    }
  }]);

  function MapInteraction(props) {
    var _this;

    MapInteraction_classCallCheck(this, MapInteraction);

    _this = MapInteraction_possibleConstructorReturn(this, MapInteraction_getPrototypeOf(MapInteraction).call(this, props));
    var scale = props.scale,
        defaultScale = props.defaultScale,
        translation = props.translation,
        defaultTranslation = props.defaultTranslation,
        minScale = props.minScale,
        maxScale = props.maxScale;
    var desiredScale;

    if (scale != undefined) {
      desiredScale = scale;
    } else if (defaultScale != undefined) {
      desiredScale = defaultScale;
    } else {
      desiredScale = 1;
    }

    _this.state = {
      scale: clamp(minScale, desiredScale, maxScale),
      translation: translation || defaultTranslation || {
        x: 0,
        y: 0
      },
      shouldPreventTouchEndDefault: false
    };
    _this.startPointerInfo = undefined;
    _this.onMouseDown = _this.onMouseDown.bind(MapInteraction_assertThisInitialized(_this));
    _this.onTouchStart = _this.onTouchStart.bind(MapInteraction_assertThisInitialized(_this));
    _this.onMouseMove = _this.onMouseMove.bind(MapInteraction_assertThisInitialized(_this));
    _this.onTouchMove = _this.onTouchMove.bind(MapInteraction_assertThisInitialized(_this));
    _this.onMouseUp = _this.onMouseUp.bind(MapInteraction_assertThisInitialized(_this));
    _this.onTouchEnd = _this.onTouchEnd.bind(MapInteraction_assertThisInitialized(_this));
    _this.onWheel = _this.onWheel.bind(MapInteraction_assertThisInitialized(_this));
    return _this;
  }

  MapInteraction_createClass(MapInteraction, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var passiveOption = src_makePassiveEventOption(false);
      this.containerNode.addEventListener('wheel', this.onWheel, passiveOption);
      /*
        Setup events for the gesture lifecycle: start, move, end touch
      */
      // start gesture

      this.containerNode.addEventListener('touchstart', this.onTouchStart, passiveOption);
      this.containerNode.addEventListener('mousedown', this.onMouseDown, passiveOption); // move gesture

      window.addEventListener('touchmove', this.onTouchMove, passiveOption);
      window.addEventListener('mousemove', this.onMouseMove, passiveOption); // end gesture

      var touchAndMouseEndOptions = _objectSpread({
        capture: true
      }, passiveOption);

      window.addEventListener('touchend', this.onTouchEnd, touchAndMouseEndOptions);
      window.addEventListener('mouseup', this.onMouseUp, touchAndMouseEndOptions);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(newProps) {
      var scale = newProps.scale != undefined ? newProps.scale : this.state.scale;
      var translation = newProps.translation || this.state.translation; // if parent has overridden state then abort current user interaction

      if (translation.x != this.state.translation.x || translation.y != this.state.translation.y || scale != this.state.scale) {
        this.setPointerState();
      }

      this.setState({
        scale: clamp(newProps.minScale, scale, newProps.maxScale),
        translation: this.clampTranslation(translation, newProps)
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.containerNode.removeEventListener('wheel', this.onWheel); // Remove touch events

      this.containerNode.removeEventListener('touchstart', this.onTouchStart);
      window.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('touchend', this.onTouchEnd); // Remove mouse events

      this.containerNode.removeEventListener('mousedown', this.onMouseDown);
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);
    }
  }, {
    key: "updateParent",
    value: function updateParent() {
      if (!this.props.onChange) {
        return;
      }

      var _this$state = this.state,
          scale = _this$state.scale,
          translation = _this$state.translation;
      this.props.onChange({
        scale: scale,
        translation: translation
      });
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

  }, {
    key: "onMouseDown",
    value: function onMouseDown(e) {
      e.preventDefault();
      this.setPointerState([e]);
    }
  }, {
    key: "onTouchStart",
    value: function onTouchStart(e) {
      e.preventDefault();
      this.setPointerState(e.touches);
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp(e) {
      this.setPointerState();
    }
  }, {
    key: "onTouchEnd",
    value: function onTouchEnd(e) {
      this.setPointerState(e.touches);
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(e) {
      if (!this.startPointerInfo || this.props.disablePan) {
        return;
      }

      e.preventDefault();
      this.onDrag(e);
    }
  }, {
    key: "onTouchMove",
    value: function onTouchMove(e) {
      if (!this.startPointerInfo) {
        return;
      }

      e.preventDefault();
      var _this$props = this.props,
          disablePan = _this$props.disablePan,
          disableZoom = _this$props.disableZoom;
      var isPinchAction = e.touches.length == 2 && this.startPointerInfo.pointers.length > 1;

      if (isPinchAction && !disableZoom) {
        this.scaleFromMultiTouch(e);
      } else if (e.touches.length === 1 && this.startPointerInfo && !disablePan) {
        this.onDrag(e.touches[0]);
      }
    } // handles both touch and mouse drags

  }, {
    key: "onDrag",
    value: function onDrag(pointer) {
      var _this2 = this;

      var _this$startPointerInf = this.startPointerInfo,
          translation = _this$startPointerInf.translation,
          pointers = _this$startPointerInf.pointers;
      var startPointer = pointers[0];
      var dragX = pointer.clientX - startPointer.clientX;
      var dragY = pointer.clientY - startPointer.clientY;
      var newTranslation = {
        x: translation.x + dragX,
        y: translation.y + dragY
      };
      this.setState({
        translation: this.clampTranslation(newTranslation),
        shouldPreventTouchEndDefault: true
      }, function () {
        return _this2.updateParent();
      });
    }
  }, {
    key: "onWheel",
    value: function onWheel(e) {
      if (this.props.disableZoom) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      var scaleChange = Math.pow(2, e.deltaY * 0.002);
      var newScale = clamp(this.props.minScale, this.state.scale + (1 - scaleChange), this.props.maxScale);
      var mousePos = this.clientPosToTranslatedPos({
        x: e.clientX,
        y: e.clientY
      });
      this.scaleFromPoint(newScale, mousePos);
    }
  }, {
    key: "setPointerState",
    value: function setPointerState(pointers) {
      if (!pointers || pointers.length === 0) {
        this.startPointerInfo = undefined;
        return;
      }

      this.startPointerInfo = {
        pointers: pointers,
        scale: this.state.scale,
        translation: this.state.translation
      };
    }
  }, {
    key: "clampTranslation",
    value: function clampTranslation(desiredTranslation) {
      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.props;
      var x = desiredTranslation.x,
          y = desiredTranslation.y;
      var _props$translationBou = props.translationBounds,
          xMax = _props$translationBou.xMax,
          xMin = _props$translationBou.xMin,
          yMax = _props$translationBou.yMax,
          yMin = _props$translationBou.yMin;
      xMin = xMin != undefined ? xMin : -Infinity;
      yMin = yMin != undefined ? yMin : -Infinity;
      xMax = xMax != undefined ? xMax : Infinity;
      yMax = yMax != undefined ? yMax : Infinity;
      return {
        x: clamp(xMin, x, xMax),
        y: clamp(yMin, y, yMax)
      };
    }
  }, {
    key: "translatedOrigin",
    value: function translatedOrigin() {
      var translation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state.translation;
      var clientOffset = this.containerNode.getBoundingClientRect();
      return {
        x: clientOffset.left + translation.x,
        y: clientOffset.top + translation.y
      };
    }
  }, {
    key: "clientPosToTranslatedPos",
    value: function clientPosToTranslatedPos(_ref) {
      var x = _ref.x,
          y = _ref.y;
      var translation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.state.translation;
      var origin = this.translatedOrigin(translation);
      return {
        x: x - origin.x,
        y: y - origin.y
      };
    }
  }, {
    key: "scaleFromPoint",
    value: function scaleFromPoint(newScale, focalPt) {
      var _this3 = this;

      var _this$state2 = this.state,
          translation = _this$state2.translation,
          scale = _this$state2.scale;
      var scaleRatio = newScale / (scale != 0 ? scale : 1);
      var focalPtDelta = {
        x: coordChange(focalPt.x, scaleRatio),
        y: coordChange(focalPt.y, scaleRatio)
      };
      var newTranslation = {
        x: translation.x - focalPtDelta.x,
        y: translation.y - focalPtDelta.y
      };
      this.setState({
        scale: newScale,
        translation: this.clampTranslation(newTranslation)
      }, function () {
        return _this3.updateParent();
      });
    }
  }, {
    key: "scaleFromMultiTouch",
    value: function scaleFromMultiTouch(e) {
      var _this4 = this;

      var startTouches = this.startPointerInfo.pointers;
      var newTouches = e.touches; // calculate new scale

      var dist0 = touchDistance(startTouches[0], startTouches[1]);
      var dist1 = touchDistance(newTouches[0], newTouches[1]);
      var scaleChange = dist1 / dist0;
      var startScale = this.startPointerInfo.scale;
      var targetScale = startScale + (scaleChange - 1) * startScale;
      var newScale = clamp(this.props.minScale, targetScale, this.props.maxScale); // calculate mid points

      var newMidPoint = midpoint(touchPt(newTouches[0]), touchPt(newTouches[1]));
      var startMidpoint = midpoint(touchPt(startTouches[0]), touchPt(startTouches[1]));
      var dragDelta = {
        x: newMidPoint.x - startMidpoint.x,
        y: newMidPoint.y - startMidpoint.y
      };
      var scaleRatio = newScale / startScale;
      var focalPt = this.clientPosToTranslatedPos(startMidpoint, this.startPointerInfo.translation);
      var focalPtDelta = {
        x: coordChange(focalPt.x, scaleRatio),
        y: coordChange(focalPt.y, scaleRatio)
      };
      var newTranslation = {
        x: this.startPointerInfo.translation.x - focalPtDelta.x + dragDelta.x,
        y: this.startPointerInfo.translation.y - focalPtDelta.y + dragDelta.y
      };
      this.setState({
        scale: newScale,
        translation: this.clampTranslation(newTranslation),
        shouldPreventTouchEndDefault: true
      }, function () {
        return _this4.updateParent();
      });
    }
  }, {
    key: "discreteScaleStepSize",
    value: function discreteScaleStepSize() {
      var _this$props2 = this.props,
          minScale = _this$props2.minScale,
          maxScale = _this$props2.maxScale;
      var delta = Math.abs(maxScale - minScale);
      return delta / 10;
    }
  }, {
    key: "changeScale",
    value: function changeScale(delta) {
      var targetScale = this.state.scale + delta;
      var _this$props3 = this.props,
          minScale = _this$props3.minScale,
          maxScale = _this$props3.maxScale;
      var scale = clamp(minScale, targetScale, maxScale);
      var rect = this.containerNode.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;
      var focalPoint = this.clientPosToTranslatedPos({
        x: x,
        y: y
      });
      this.scaleFromPoint(scale, focalPoint);
    }
  }, {
    key: "renderControls",
    value: function renderControls() {
      var _this5 = this;

      var step = this.discreteScaleStepSize();
      return external_commonjs_react_commonjs2_react_amd_React_root_React_default.a.createElement(src_Controls, {
        onClickPlus: function onClickPlus() {
          return _this5.changeScale(step);
        },
        onClickMinus: function onClickMinus() {
          return _this5.changeScale(-step);
        },
        plusBtnContents: this.props.plusBtnContents,
        minusBtnContents: this.props.minusBtnContents,
        btnClass: this.props.btnClass,
        plusBtnClass: this.props.plusBtnClass,
        minusBtnClass: this.props.minusBtnClass,
        controlsClass: this.props.controlsClass,
        scale: this.state.scale,
        minScale: this.props.minScale,
        maxScale: this.props.maxScale,
        disableZoom: this.props.disableZoom
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      var _this$props4 = this.props,
          showControls = _this$props4.showControls,
          children = _this$props4.children;
      var scale = this.state.scale; // Defensively clamp the translation. This should not be necessary if we properly set state elsewhere.

      var translation = this.clampTranslation(this.state.translation);
      /*
        This is a little trick to allow the following ux: We want the parent of this
        component to decide if elements inside the map are clickable. Normally, you wouldn't
        want to trigger a click event when the user *drags* on an element (only if they click
        and then release w/o dragging at all). However we don't want to assume this
        behavior here, so we call `preventDefault` and then let the parent check
        `e.defaultPrevented`. That value being true means that we are signalling that
        a drag event ended, not a click. 
      */

      var handleEventCapture = function handleEventCapture(e) {
        if (_this6.state.shouldPreventTouchEndDefault) {
          e.preventDefault();

          if (_this6.startPointerInfo === undefined) {
            _this6.setState({
              shouldPreventTouchEndDefault: false
            });
          }
        }
      };

      return external_commonjs_react_commonjs2_react_amd_React_root_React_default.a.createElement("div", {
        ref: function ref(node) {
          _this6.containerNode = node;
        },
        style: {
          height: '100%',
          width: '100%',
          position: 'relative',
          // for absolutely positioned children
          touchAction: 'none'
        },
        onClickCapture: handleEventCapture,
        onTouchEndCapture: handleEventCapture
      }, (children || undefined) && children({
        translation: translation,
        scale: scale
      }), (showControls || undefined) && this.renderControls());
    }
  }]);

  return MapInteraction;
}(external_commonjs_react_commonjs2_react_amd_React_root_React_["Component"]);

/* harmony default export */ var src_MapInteraction = (MapInteraction_MapInteraction);
// CONCATENATED MODULE: ./src/MapInteractionCSS.jsx


/*
  This component provides a map like interaction to any content that you place in it. It will let
  the user zoom and pan the children by scaling and translating props.children using css.
*/

var MapInteractionCSS_MapInteractionCSS = function MapInteractionCSS(props) {
  return external_commonjs_react_commonjs2_react_amd_React_root_React_default.a.createElement(src_MapInteraction, props, function (_ref) {
    var translation = _ref.translation,
        scale = _ref.scale;
    // Translate first and then scale.  Otherwise, the scale would affect the translation.
    var transform = "translate(".concat(translation.x, "px, ").concat(translation.y, "px) scale(").concat(scale, ")");
    return external_commonjs_react_commonjs2_react_amd_React_root_React_default.a.createElement("div", {
      style: {
        height: '100%',
        width: '100%',
        position: 'relative',
        // for absolutely positioned children
        overflow: 'hidden',
        touchAction: 'none',
        // Not supported in Safari :(
        msTouchAction: 'none',
        cursor: 'all-scroll',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }
    }, external_commonjs_react_commonjs2_react_amd_React_root_React_default.a.createElement("div", {
      style: {
        transform: transform,
        transformOrigin: '0 0 '
      }
    }, props.children));
  });
};

/* harmony default export */ var src_MapInteractionCSS = (MapInteractionCSS_MapInteractionCSS);
// CONCATENATED MODULE: ./src/index.js
/* concated harmony reexport MapInteractionCSS */__webpack_require__.d(__webpack_exports__, "MapInteractionCSS", function() { return src_MapInteractionCSS; });
/* concated harmony reexport MapInteraction */__webpack_require__.d(__webpack_exports__, "MapInteraction", function() { return src_MapInteraction; });



/* harmony default export */ var src = __webpack_exports__["default"] = (src_MapInteraction);

/***/ })
/******/ ]);
});