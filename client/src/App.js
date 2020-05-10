import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from 'src/screens/Home';
import Room from 'src/screens/Room';
import 'src/styles.css';

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route
                    exact
                    path="/"
                    render={() => <Home />}
                />
                <Route
                    path="/:roomName"
                    render={({ match }) => <Room roomName={match.params.roomName} />}
                />
            </Switch>
        </BrowserRouter>
    );
}

export default App;