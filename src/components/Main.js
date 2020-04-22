import React from 'react';
import { Switch, Route } from "react-router-dom";
import { Call, Home } from '../pages';

export default function Main() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/calls/:id" component={Call} />
      <Route path="*" component={Home} />
    </Switch>
  )
};
