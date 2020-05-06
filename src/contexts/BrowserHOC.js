import React from 'react';
import { BrowserContext } from './';

export default function withBrowserContext(Component) {
  function WrapperComponent(props) {
    return (
      <BrowserContext.Consumer>
        {state => <Component {...props} {...state} />}
      </BrowserContext.Consumer>
    );
  }

  WrapperComponent.displayName = `BrowserHOC.${Component.displayName || Component.name || 'Component'}`;
  return WrapperComponent
}