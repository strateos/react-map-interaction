import React from 'react';
import { shallow, mount } from 'enzyme';
import Controls from './Controls';

describe("Controls", () => {
  let wrapper;
  afterEach(() => {
    if (wrapper) wrapper.unmount();
  });

  test("renders shallow base case", () => {
    wrapper = shallow(<Controls onClickPlus={() => {}} onClickMinus={() => {}}/>);
  });

  test("renders plus/minus buttons", () => {
    wrapper = shallow(
      <Controls
        onClickPlus={() => {}}
        onClickMinus={() => {}}
        plusBtnClass="plus-button-klass"
        minusBtnClass="minus-button-klass"
      />
    );
    expect(wrapper.find('button').length).toBe(2);
    expect(wrapper.find('button.plus-button-klass').length).toBe(1);
    expect(wrapper.find('button.minus-button-klass').length).toBe(1);
  })

  test("renders button labels by default", () => {
    wrapper = shallow(
      <Controls
        onClickPlus={() => {}}
        onClickMinus={() => {}}
        plusBtnClass="plus-button-klass"
        minusBtnClass="minus-button-klass"
      />
    );
    expect(wrapper.find('button.plus-button-klass').text()).toBe("+");
    expect(wrapper.find('button.minus-button-klass').text()).toBe("-");
  });

  test("alerts on click events", () => {
    const plusCallback = jest.fn();
    const minusCallback = jest.fn();

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
    expect(plusCallback.mock.calls.length).toBe(1);
    expect(minusCallback.mock.calls.length).toBe(1);
    minusBtn.simulate('click');
    expect(plusCallback.mock.calls.length).toBe(1);
    expect(minusCallback.mock.calls.length).toBe(2);
  });
});
