import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import Canvas from './Canvas.js';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/painting/:paintingId" component={Canvas} />
            </Switch>
        </Router>
    );
}

export default App;
