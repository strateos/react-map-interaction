import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
const jsdom =  require('jsdom-global');

import MapInteraction from './MapInteraction';
import { mockContainerRef } from './TestUtil.js';

describe("MapInteraction", () => {
  let cleanupDom;
  beforeEach(() => {
    cleanupDom = jsdom();
  })

  let refStub;
  let wrapper;
  afterEach(() => {
    if (wrapper) wrapper.unmount();
    if (refStub) refStub.restore();
    cleanupDom();
  });

  it("full mount - calls children with params", () => {
    const childrenCallback = sinon.fake();
    wrapper = mount(
      <MapInteraction>
        {childrenCallback}
      </MapInteraction>
    );
    const argsList = childrenCallback.args[0];
    expect(argsList.length).to.equal(1);

    const { translation, scale } = argsList[0];
    expect(!isNaN(scale)).to.equal(true);
    expect(!isNaN(translation.x)).to.equal(true);
    expect(!isNaN(translation.y)).to.equal(true);
  });

  it("full mount - uses default props", () => {
    const childrenCallback = sinon.fake();
    wrapper = mount(
      <MapInteraction defaultTranslation={{ x: 100, y: 105 }} defaultScale={3}>
        {childrenCallback}
      </MapInteraction>
    );
    const { translation, scale } = childrenCallback.args[0][0];
    expect(translation).to.deep.equal({ x: 100, y: 105 });
    expect(scale).to.equal(3);
  });

  it("scales from point with children callback", () => {
    refStub = mockContainerRef();
    const changeCb = sinon.fake();
    wrapper = shallow(
      <MapInteraction
        defaultTranslation={{ x: 100, y: 105 }}
        defaultScale={3}
        onChange={changeCb}
      />
    );
    wrapper.instance().changeScale(-1);
    const argsList = changeCb.args;
    expect(argsList.length).to.equal(1);
    expect(argsList[0][0].scale).to.equal(2);
  });

  it("scale from point state change", () => {
    refStub = mockContainerRef();
    wrapper = shallow(
      <MapInteraction
        defaultTranslation={{ x: 100, y: 105 }}
        defaultScale={3}
      />
    );
    expect(wrapper.state().scale).to.equal(3);
    wrapper.instance().changeScale(-1);
    expect(wrapper.state().scale).to.equal(2);
  });
});
