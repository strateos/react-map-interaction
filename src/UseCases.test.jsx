import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
const jsdom = require('jsdom-global');

import MapInteractionCSS from './MapInteractionCSS';
import { mockContainerRef, mockClientRect } from './TestUtil.js';

/*
  Utils
*/

// Triggers mouse events
// https://ghostinspector.com/blog/simulate-drag-and-drop-javascript-casperjs/
// Would be great to use the newer MouseEvent constructor, but
// jsom doesnt yet support it https://github.com/jsdom/jsdom/issues/1911
function fireMouseEvent(type, elem, centerX, centerY) {
  const evt = document.createEvent('MouseEvents');
  evt.initMouseEvent(type, true, true, window, 1, 1, 1, centerX, centerY, false, false, false, false, 0, elem);
  elem.dispatchEvent(evt);
};

// Gets the css `transform` value from the .child (which is assumed
// to be the child element passed to RMI).
// @param enzymeWrapper The enzyme wrapper of MapInteractionCSS
function getTransformString(enzymeWrapper) {
  const child = enzymeWrapper.getDOMNode().querySelector(".child");
  const parent = child.parentElement;
  return parent.style.transform;
}

// Extracts the translation css value from the `transform` css string
//  `transform: translate(10px, 30px) scale(2)` --> "10px, 30px"
//  `transform: translate(0px, 10px) blah(foo)` --> "0px, 10px"
// @param enzymeWrapper The enzyme wrapper of MapInteractionCSS
function getTranslation(enzymeWrapper) {
  const transformString = getTransformString(enzymeWrapper);
  const translateRegex = new RegExp(/translate\((.*?)\)/);
  const translateMatch = translateRegex.exec(transformString);
  return translateMatch[1];
}

// Extracts the scale css value from the transform css value
//  `transform: blah(foo) scale(2)`           --> 2
//  `transform: translate(0px 10px) scale(3)` --> 3
// @param enzymeWrapper The enzyme wrapper of MapInteractionCSS
function getScale(enzymeWrapper) {
  const transformString = getTransformString(enzymeWrapper);
  const scaleRegex = new RegExp(/scale\((.*?)\)/);
  const scaleMatch = scaleRegex.exec(transformString);
  return parseFloat(scaleMatch[1]);
}

// Given the value extracted in `getTranslation` return
// the constituent coordinates x,y
//   `0px 10px`       --> { x: 0, y: 10 }
//   ` 0px   10.5px ` --> { x: 0, y: 10 }
// @param translationString The css value for `translate`
function coordsFromTranslationString(translationString) {
  const [x, y] = translationString
    .trim()
    .split(" ")
    .filter(s => !!s)
    .map(s => s.split("px")[0])
    .map(parseFloat);
  return { x, y };
}

// @param enzymeWrapper The wrapper from mounting MapInteractionCSS with a .child element
function checkTransform(enzymeWrapper, scale, translation) {
  const translationString = getTranslation(enzymeWrapper);
  expect(translationString).to.deep.equal(`${translation.x}px, ${translation.y}px`);
  expect(getScale(enzymeWrapper)).to.equal(scale);
}

function makeWheelEvent(deltaY = 1) {
  // For some reason we need to manually attach
  // event params to the event instead of using the constructor
  // jsdom... https://github.com/jsdom/jsdom/issues/1434
  const evt = new Event("wheel", { bubbles: true });
  evt.deltaY = deltaY;
  evt.deltaX = 0;
  evt.clientX = 50;
  evt.clientY = 50;
  return evt;
}

// Utility for mounting an RMI instance and getting back some useful
// handles on the wrapper and sub nodes
// Note that it creates an uncontrolled instance
function makeDefaultWrapper(scale = 1, translation = { x: 0, y: 0 }) {
  const wrapper = mount(
    <MapInteractionCSS
      defaultValue={{ scale, translation }}
    >
      <div className="child">hello</div>
    </MapInteractionCSS>
  );
  const child = wrapper.getDOMNode().querySelector(".child");
  return { wrapper, child };
}

/*
  Use case tests are designed to test the highest level
  boundary of the component. This serves two purposes, a) as documentation
  for your top level functionality, and b) to allow easier refactoring of
  internals without having to change the tests.

  These tests would be even better done via something like Selenium
  or https://www.cypress.io/ or phantomjs which exercise a real browser.
*/
describe("Use case testing", () => {
  let cleanupDom;
  beforeEach(() => {
    cleanupDom = jsdom();
  })

  let refStub;
  let wrapper;
  let rectStub;
  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = undefined;
    };
    if (refStub) refStub.restore();
    if (rectStub) rectStub.restore();
    cleanupDom();
  });

  it("applies default translation and scale to the childs parent node", () => {
    wrapper = makeDefaultWrapper().wrapper;
    checkTransform(
      wrapper,
      1,
      { x: 0, y: 0 }
    );
  });

  it("applies custom translation and scale to the childs parent node", () => {
    const scale = 2;
    const translation = { x: 50, y: 100 };
    wrapper = makeDefaultWrapper(scale, translation).wrapper;

    checkTransform(
      wrapper,
      scale,
      translation
    );
  });

  it("single pointer drag changes translation", () => {
    const nodes = makeDefaultWrapper();
    wrapper = nodes.wrapper;
    const child = nodes.child;

    // check default transform on init
    checkTransform(
      wrapper,
      1,
      { x: 0, y: 0 }
    );

    fireMouseEvent('mousedown', child, 10, 10);
    fireMouseEvent('mousemove', window, 30, 60);

    checkTransform(
      wrapper,
      1,
      { x: 20, y: 50 }
    );
  });

  it("positive wheel event decreases scale and adjusts translation", () => {
    const initialScale = 1;
    const initialTranslation = { x: 10, y: 10 };
    const nodes = makeDefaultWrapper(initialScale, initialTranslation);
    wrapper = nodes.wrapper;

    const evt = makeWheelEvent(100);
    nodes.child.dispatchEvent(evt);

    // Positive change in wheel decreases the scale
    const newScale = getScale(wrapper);
    const newTranslation = getTranslation(wrapper);
    expect(newScale).to.be.lessThan(initialScale);

    // Since the scale has gone down, the component will have
    // increased the translation to keep the focal point beneath the cursor
    // TODO Test for exactness, not inequality
    const { x: newX, y: newY } = coordsFromTranslationString(newTranslation);
    expect(newX).to.be.greaterThan(initialTranslation.x);
    expect(newY).to.be.greaterThan(initialTranslation.y);
  });

  it("negative wheel event increases scale and adjusts translation", () => {
    const initialScale = 1;
    const initialTranslation = { x: 10, y: 10 };
    const nodes = makeDefaultWrapper(initialScale, initialTranslation);
    wrapper = nodes.wrapper;

    const evt = makeWheelEvent(-100);
    nodes.child.dispatchEvent(evt);

    const newScale       = getScale(wrapper);
    const newTranslation = getTranslation(wrapper);

    // Negative change in wheel decreases the scale
    expect(newScale).to.be.greaterThan(initialScale);

    // Since the scale has gone up, the component will have
    // decreased the translation to keep the focal point beneath the cursor
    // TODO Test for exactness, not inequality
    const { x: newX, y: newY } = coordsFromTranslationString(newTranslation);
    expect(newX).to.be.lessThan(initialTranslation.x);
    expect(newY).to.be.lessThan(initialTranslation.y);
  });

  it("allows clicking a plus button to increase scale", () => {
    refStub = mockContainerRef();
    const initialScale = 1;
    const initialTranslation = { x: 0, y: 0 };

    wrapper = mount(
      <MapInteractionCSS
        showControls
        plusBtnClass="plus-button"
        defaultScale={initialScale}
        defaultTranslation={initialTranslation}
      >
        <div className="child" />
      </MapInteractionCSS>
    );

    const plusButton = wrapper.find("button.plus-button");
    plusButton.simulate('click');

    const newScale       = getScale(wrapper);
    const newTranslation = getTranslation(wrapper);

    // The plus button increments scale
    expect(newScale).to.be.greaterThan(initialScale);

    // Scaling using the controls will use the center of
    // the content as the focal point.
    // TODO calculate exact scale,translation
    const { x: newX, y: newY } = coordsFromTranslationString(newTranslation);
    expect(newX).to.be.lessThan(initialTranslation.x);
    expect(newY).to.be.lessThan(initialTranslation.y);
  });

  it("handles single touch drag", () => {
    const nodes = makeDefaultWrapper();
    wrapper = nodes.wrapper;

    // manually simulate a touchstart event
    const evt = new Event('touchstart', { bubbles: true });
    evt.touches = [{ clientX: 0, clientY: 0 }];
    const evt2 = new Event('touchmove', { bubbles: true });
    evt2.touches = [{ clientX: 30, clientY: 0 }];
    const evt3 = new Event('touchend', { bubbles: true });
    evt3.touches = [{ clientX: 30, clientY: 0 }];

    nodes.child.dispatchEvent(evt);
    window.dispatchEvent(evt2);
    window.dispatchEvent(evt3);

    checkTransform(
      wrapper,
      1,
      { x: 30, y: 0 }
    );
  });

  // Touch down and immediate touch up is a no-op
  it("two touches down then up wont change scale or translation", () => {
    rectStub = mockClientRect(); // Need client rect
    const initialScale = 2;
    const initialTranslation = { x: 10, y: 10 };
    const nodes = makeDefaultWrapper(initialScale, initialTranslation);
    wrapper = nodes.wrapper;

    const evt = new Event('touchstart', { bubbles: true });
    evt.touches = [{ clientX: 10, clientY: 10 }, { clientX: 100, clientY: 10 }];
    const evt2 = new Event('touchend', { bubbles: true });
    evt2.touches = [];

    nodes.child.dispatchEvent(evt);
    window.dispatchEvent(evt2);

    checkTransform(
      wrapper,
      initialScale,
      initialTranslation
    );
  });

  // This is the common case of two finger zoom, standard pinch to zoom with both
  // fingers moving way from one another.
  it("handles two finger zoom in with change in both dimensions, both fingers move", () => {
    rectStub = mockClientRect(); // Need getBoundingClientRect

    const initialScale = 2;
    const initialTranslation = { x: 10, y: 10 };
    const nodes = makeDefaultWrapper(initialScale, initialTranslation);
    wrapper = nodes.wrapper;

    const touchDeltaX = 50;
    const touchDeltaY = 50;

    // Trigger touches down, move, then up
    const evt = new Event('touchstart', { bubbles: true });
    evt.touches = [{ clientX: 10, clientY: 10 }, { clientX: 100, clientY: 100 }];
    const ev2 = new Event('touchmove');
    ev2.touches = [{ clientX: 10 - touchDeltaX, clientY: 10 - touchDeltaY }, { clientX: 100 + touchDeltaX, clientY: 100 + touchDeltaY }];
    const evt3 = new Event('touchend', { bubbles: true });
    evt3.touches = [];

    nodes.child.dispatchEvent(evt);
    window.dispatchEvent(ev2);
    window.dispatchEvent(evt3);

    const newScale = getScale(wrapper);
    const newTranslation = getTranslation(wrapper);

    expect(newScale).to.be.greaterThan(initialScale);

    // Since the scale has gone up, the component will have
    // decreased the translation to keep the focal point beneath the cursor
    // TODO Test for exactness, not inequality
    const { x: newX, y: newY } = coordsFromTranslationString(newTranslation);
    expect(newX).to.be.lessThan(initialTranslation.x);
    expect(newY).to.be.lessThan(initialTranslation.y);
  });

  // Two finger zoom, but one finger remains stationary and the other only
  // moves along the x-axis.
  it("handles two finger zoom in with change in only one dimension, one finger move", () => {
    // simulate two finger pinch and zoom out (fingers together)
    // demonstrating that the scale decreases and translation offsets
    rectStub = mockClientRect(); // Need client rect
    const initialScale = 1;
    const initialTranslation = { x: 0, y: 0 };
    const nodes = makeDefaultWrapper(initialScale, initialTranslation);
    wrapper = nodes.wrapper;

    const touchDeltaX = 50;

    // Trigger touches down, move, then up
    const evt = new Event('touchstart', { bubbles: true });
    evt.touches = [{ clientX: 10, clientY: 10 }, { clientX: 100, clientY: 10 }];
    const ev2 = new Event('touchmove');
    ev2.touches = [{ clientX: 10, clientY: 10 }, { clientX: 100 + touchDeltaX, clientY: 10 }];
    const evt3 = new Event('touchend', { bubbles: true });
    evt3.touches = [];

    nodes.child.dispatchEvent(evt);
    window.dispatchEvent(ev2);
    window.dispatchEvent(evt3);

    const newScale = getScale(wrapper);
    const newTranslation = getTranslation(wrapper);

    expect(newScale).to.be.greaterThan(initialScale);

    // Since the scale has gone up, the component will have
    // decreased the translation to keep the focal point beneath the cursor
    // TODO Test for exactness, not inequality
    const { x: newX, y: newY } = coordsFromTranslationString(newTranslation);
    expect(newX).to.be.lessThan(initialTranslation.x);
    expect(newY).to.be.lessThan(initialTranslation.y);
  });

  it("handles two finger zoom in with change in both dimensions, one finger move", () => {
    // simulate two finger pinch and zoom out (fingers together)
    // demonstrating that the scale decreases and translation offsets
    rectStub = mockClientRect(); // Need client rect

    const initialScale = 2;
    const initialTranslation = { x: 0, y: 0 };
    const nodes = makeDefaultWrapper(initialScale, initialTranslation);
    wrapper = nodes.wrapper;

    const touchDeltaX = 50;
    const touchDeltaY = 50;

    // Trigger touches down, move, then up
    const evt = new Event('touchstart', { bubbles: true });
    evt.touches = [{ clientX: 10, clientY: 10 }, { clientX: 100, clientY: 100 }];
    const ev2 = new Event('touchmove');
    ev2.touches = [{ clientX: 10, clientY: 10 }, { clientX: 100 + touchDeltaX, clientY: 100 + touchDeltaY }];
    const evt3 = new Event('touchend', { bubbles: true });
    evt3.touches = [];

    nodes.child.dispatchEvent(evt);
    window.dispatchEvent(ev2);
    window.dispatchEvent(evt3);

    const newScale = getScale(wrapper);
    const newTranslation = getTranslation(wrapper);

    expect(newScale).to.be.greaterThan(initialScale);

    // Since the scale has gone up, the component will have
    // decreased the translation to keep the focal point beneath the cursor
    // TODO Test for exactness, not inequality
    const { x: newX, y: newY } = coordsFromTranslationString(newTranslation);
    expect(newX).to.be.lessThan(initialTranslation.x);
    expect(newY).to.be.lessThan(initialTranslation.y);
  });
});
