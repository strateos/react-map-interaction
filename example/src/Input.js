import React from 'react';

const LABEL_MIN_WIDTH = '230px';
const labelStyle = {
  display: 'inline-block',
  fontFamily: '"Courier New", Courier, monospace',
  minWidth: LABEL_MIN_WIDTH
}

const Input = ({ type, label, value, onChange }) => {
  switch (type) {
    case 'number':
      return (
        <label style={{ display: 'block' }}>
          <span style={ labelStyle }>{label}: </span>
          <input onChange={e => onChange( Number(e.target.value) )} type={ type } value={ value } />
        </label>
      );

    case 'string':
      return (
        <label style={{ display: 'block' }}>
          <span style={ labelStyle }>{label}: </span>
          <input onChange={e => onChange(e.target.value)} type={ type } value={ value } />
        </label>
      );

    case 'boolean':
      return (
        <label style={{ display: 'block' }}>
          <span style={ labelStyle }>{label}: </span>
          <input onChange={e => onChange(e.target.checked)} checked={ value } type="checkbox" />
        </label>
      );

    default:
      return '';
  }
}

export default Input;
