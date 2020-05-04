import React from 'react';
import { Switch, Route } from "react-router-dom";
import { Chat, Home } from '../pages';

export default function Main() {
  return (
    <div className="container">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/chat/:id" component={Chat} />
        <Route path="*" component={Home} />
      </Switch>
    </div>
  )
};
