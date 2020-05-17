import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import Controls from './Controls';

const jsdom = require('jsdom-global');

describe("Controls", () => {
  let wrapper;
  afterEach(() => {
    if (wrapper) wrapper.unmount();
  });

  it("renders shallow base case", () => {
    wrapper = shallow(<Controls onClickPlus={() => {}} onClickMinus={() => {}}/>);
    expect(wrapper);
  });

  it("renders plus/minus buttons", () => {
    wrapper = shallow(
      <Controls
        onClickPlus={() => {}}
        onClickMinus={() => {}}
        plusBtnClass="plus-button-klass"
        minusBtnClass="minus-button-klass"
      />
    );
    expect(wrapper.find('button').length).to.equal(2);
    expect(wrapper.find('button.plus-button-klass').length).to.equal(1);
    expect(wrapper.find('button.minus-button-klass').length).to.equal(1);
  });

  it("renders button labels by default", () => {
    wrapper = shallow(
      <Controls
        onClickPlus={() => {}}
        onClickMinus={() => {}}
        plusBtnClass="plus-button-klass"
        minusBtnClass="minus-button-klass"
      />
    );
    expect(wrapper.find('button.plus-button-klass').text()).to.equal("+");
    expect(wrapper.find('button.minus-button-klass').text()).to.equal("-");
  })

  describe("full dom tests", () => {
    let cleanupDom;
    beforeEach(() => {
      cleanupDom = jsdom();
    })
    let wrapper;
    afterEach(() => {
      if (wrapper) wrapper.unmount();
      cleanupDom();
    });

    it("alerts on click events", () => {
      const plusCallback = sinon.fake();
      const minusCallback = sinon.fake();

      // required to mount otherwise .simulate doesn't invoke a synthetic event
      wrapper = mount(
        <Controls
          onClickPlus={plusCallback}
          onClickMinus={minusCallback}
          plusBtnClass="plus-button-klass"
          minusBtnClass="minus-button-klass"
        />
      );

      const plusBtn = wrapper.find('button.plus-button-klass').first()
      const minusBtn = wrapper.find('button.minus-button-klass').first();
      plusBtn.simulate('click');
      minusBtn.simulate('click');
      minusBtn.simulate('click');
      expect(plusCallback.callCount).to.equal(1);
      expect(minusCallback.callCount).to.equal(2);
    });
  });
});
