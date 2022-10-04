import React from 'react';
import styles from './callout.module.css';
import MDXContent from '@theme/MDXContent';

const typeToColor = new Map([
  ['warn', {color: '#856404', backgroundColor: '#fff3cd', borderColor: '#ffeeba'}],
  ['info', {color: '#004085', backgroundColor: '#cce5ff', borderColor: '#b8daff'}],
])

export default function Callout({children, type}) {
  const {color, backgroundColor, borderColor} = typeToColor.get(type) || {};
  return (
    <div
      className={styles.callout}
      style={{
        color,
        backgroundColor,
        borderColor
      }}
    >{children}</div>
  );
}