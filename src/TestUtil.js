import sinon from 'sinon';

import MapInteraction from './MapInteraction';

// mock the containerNode ref since it wont get set in a shallow render
// this is required if your test needs to simulate dom events
function mockContainerRef() {
  return sinon.stub(MapInteraction.prototype, 'getContainerNode')
    .callsFake(() => {
      // _TODO_ new Element() possible?
      return {
        addEventListener: function() {},
        removeEventListener: function() {},
        getBoundingClientRect: function() {
          return { left: 0, width: 200, top: 0, height: 200 };
        }
      }
    });
};

// Just mock client rect. Useful for if you need the native
// event listeners but still need to mock the client rect, which
// jsdom mocks but with 0s as default values.
function mockClientRect() {
  return sinon.stub(MapInteraction.prototype, 'getContainerBoundingClientRect')
    .callsFake(() => {
      return { left: 0, width: 200, top: 0, height: 200 };
    });
}

export { mockContainerRef, mockClientRect };
