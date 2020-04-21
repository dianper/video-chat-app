import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import { Call, Home } from '../pages';

function Routers() {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/calls/:id">
                    <Call />
                </Route>
                <Route path="*">
                    <Home />
                </Route>
            </Switch>
        </Router>
    )
};

export default Routers;