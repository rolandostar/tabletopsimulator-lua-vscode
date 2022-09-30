import React from 'react';

const typeToColor = new Map([
  ['warn', {color: '#856404', backgroundColor: '#fff3cd', borderColor: '#ffeeba'}],
])

export default function Callout({children, type}) {
  const {color, backgroundColor, borderColor} = typeToColor.get(type) || {};
  return (
    <span
      style={{
        border: '1px solid transparent',
        padding: '.75rem 1.25rem',
        borderRadius: '0.7em',
        color,
        backgroundColor,
        borderColor
      }}
    >
      {children}
    </span>
  );
}