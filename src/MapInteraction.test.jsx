import React from 'react';
import { mount, shallow } from 'enzyme';

import MapInteraction from './MapInteraction';

describe("MapInteraction", () => {
  // mock the containerNode ref since it wont get set in a shallow render
  const mockContainerRef = () => {
    jest.spyOn(MapInteraction.prototype, 'getContainerNode')
      .mockImplementation(() => {
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

  let wrapper;
  afterEach(() => {
    if (wrapper) wrapper.unmount();
    jest.restoreAllMocks();
  });


  test("full mount - calls children with params", () => {
    const childrenCallback = jest.fn();
    wrapper = mount(
      <MapInteraction>
        {childrenCallback}
      </MapInteraction>
    );
    const argsList = childrenCallback.mock.calls[0];
    expect(argsList.length).toBe(1);

    const { translation, scale } = argsList[0];
    expect(!isNaN(scale)).toBeTruthy();
    expect(!isNaN(translation.x)).toBeTruthy();
    expect(!isNaN(translation.y)).toBeTruthy();
  });

  test("full mount - uses default props", () => {
    const childrenCallback = jest.fn();
    wrapper = mount(
      <MapInteraction defaultTranslation={{ x: 100, y: 105 }} defaultScale={3}>
        {childrenCallback}
      </MapInteraction>
    );
    const { translation, scale } = childrenCallback.mock.calls[0][0];
    expect(translation).toEqual({ x: 100, y: 105 });
    expect(scale).toBe(3);
  });

  test("scales from point with children callback", () => {
    mockContainerRef();
    const changeCb = jest.fn();
    wrapper = shallow(
      <MapInteraction
        defaultTranslation={{ x: 100, y: 105 }}
        defaultScale={3}
        onChange={changeCb}
      />
    );
    wrapper.instance().changeScale(-1);
    const argsList = changeCb.mock.calls[0];
    expect(argsList.length).toBe(1);
    expect(argsList[0].scale).toBe(2);
  });

  test("scale from point state change", () => {
    mockContainerRef();
    wrapper = shallow(
      <MapInteraction
        defaultTranslation={{ x: 100, y: 105 }}
        defaultScale={3}
      />
    );
    expect(wrapper.state().scale).toBe(3);
    wrapper.instance().changeScale(-1);
    expect(wrapper.state().scale).toBe(2);
  });
});
