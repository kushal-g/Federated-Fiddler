/**
 *
 * Loader
 *
 */
import * as React from 'react';
import './index.css';

interface Props {}

export function Loader(props: Props) {
  return (
    <div className="loader">
      <div className="loader__bar"></div>
      <div className="loader__bar"></div>
      <div className="loader__bar"></div>
      <div className="loader__bar"></div>
      <div className="loader__bar"></div>
      <div className="loader__ball"></div>
    </div>
  );
}
