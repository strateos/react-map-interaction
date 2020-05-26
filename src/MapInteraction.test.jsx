import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
const jsdom =  require('jsdom-global');

import MapInteraction, { MapInteractionControlled } from './MapInteraction';
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

  it("full mount, controlled", () => {
    const childrenCallback = sinon.fake();
    wrapper = mount(
      <MapInteraction
        value={{
          translation: { x: 100, y: 105 },
          scale: 3
        }}
        onChange={() => {}}
      >
        {childrenCallback}
      </MapInteraction>
    );
    const { translation, scale } = childrenCallback.args[0][0];
    expect(translation).to.deep.equal({ x: 100, y: 105 });
    expect(scale).to.equal(3);
  });

  it("scales from point when fully controlled", () => {
    refStub = mockContainerRef();
    const changeCb = sinon.fake();
    wrapper = mount(
      <MapInteraction
        value={{
          translation: { x: 100, y: 105 },
          scale: 3
        }}
        onChange={changeCb}
      />
    );
    const instance = wrapper.find(MapInteractionControlled).instance();
    instance.changeScale(-1);
    const argsList = changeCb.args;
    expect(argsList.length).to.equal(1);
    expect(argsList[0][0].scale).to.equal(2);
  });

  it("scale from point state change when uncontrolled", () => {
    refStub = mockContainerRef();
    wrapper = mount(
      <MapInteraction
        defaultValue={{
          translation: { x: 100, y: 105 },
          scale: 3
        }}
      />
    );
    expect(wrapper.state().value.scale).to.equal(3);
    const instance = wrapper.find(MapInteractionControlled).instance();
    instance.changeScale(-1);
    expect(wrapper.state().value.scale).to.equal(2);
  });

  it("fully controlled with changeScale called", () => {
    class Controller extends Component {
      constructor(props) {
        super(props);
        this.state = { value: { scale: 1, translation: { x: 0, y: 0 } }};
      }

      render() {
        return (
          <MapInteraction
            value={this.state.value}
            onChange={(params) => {
              const promise = new Promise((resolve) => {
                this.setState({ value: params }, resolve);
              });
              this.props.onSetState(promise);
            }}
          />
        );
      }
    }

    let setStatePromise;

    refStub = mockContainerRef();
    wrapper = mount(<Controller onSetState={(p) => { setStatePromise = p }} />);
    const controller = wrapper.find(Controller);
    const rmi = wrapper.find(MapInteraction);
    const rmiInner = rmi.find(MapInteractionControlled);

    // initial state
    expect(controller.state().value.scale).to.equal(1);
    expect(rmi.props().value.scale).to.equal(1);
    expect(rmiInner.props().value.scale).to.equal(1);

    rmiInner.instance().changeScale(1);

    return setStatePromise.then(() => {
      wrapper.update();
      const controller = wrapper.find(Controller);
      const rmi = wrapper.find(MapInteraction);
      const rmiInner = rmi.find(MapInteractionControlled);

      expect(controller.state().value.scale).to.equal(2);
      expect(rmi.props().value.scale).to.equal(2);
      expect(rmiInner.props().value.scale).to.equal(2);
    });
  });

  // This is an unhappy path. The caller of RMI should not switch from
  // controlled to uncontrolled. We just want to make sure we dont blow up.
  // The caller should be able to switch from controlled-uncontrolled-controlled
  // and have the component work back in a fully controlled state, but
  // it wont work while in the intermediary uncontrolled state.
  it("parent switches from controlled to uncontrolled", () => {
    class Controller extends Component {
      constructor(props) {
        super(props);
        this.state = { value: { scale: 1, translation: { x: 0, y: 0 } } };
      }

      render() {
        return (
          <MapInteraction
            value={this.state.value}
            onChange={(value) => {
              const promise = new Promise((resolve) => {
                this.setState({ value }, resolve);
              });
              this.props.onSetState(promise);
            }}
          />
        );
      }
    }

    let setStatePromise;

    refStub = mockContainerRef();
    wrapper = mount(<Controller onSetState={(p) => { setStatePromise = p }} />);
    const controller = wrapper.find(Controller);
    const rmi = wrapper.find(MapInteraction);
    const rmiInner = rmi.find(MapInteractionControlled);

    // initial state
    expect(controller.state().value.scale).to.equal(1);
    expect(rmi.props().value.scale).to.equal(1);
    expect(rmiInner.props().value.scale).to.equal(1);

    // switch to uncontrolled then back again
    controller.instance().setState({ value: undefined });
    controller.instance().setState({ value: { scale: 2 , translation: { x: 0, y: 0 } } });

    rmiInner.instance().changeScale(1);

    return setStatePromise.then(() => {
      wrapper.update();
      const controller = wrapper.find(Controller);
      const rmi = wrapper.find(MapInteraction);
      const rmiInner = rmi.find(MapInteractionControlled);

      expect(controller.state().value.scale).to.equal(3);
      expect(rmi.props().value.scale).to.equal(3);
      expect(rmiInner.props().value.scale).to.equal(3);
    });
  });
});
