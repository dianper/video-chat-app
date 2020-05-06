import React from 'react';
import { Switch, Route } from "react-router-dom";
import { Room, Home } from '../../pages';

export default function Main() {
  return (
    <div className="container">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/room/:roomName" component={Room} />
        <Route path="*" component={Home} />
      </Switch>
    </div>
  )
};
