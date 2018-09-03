import "babel-polyfill";
import "semantic-ui-css/semantic.min.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Switch } from "react-router";

import Login from "./login";
import Chat from "./chat";
import { UserContext } from "./context";

class App extends React.PureComponent {
    updateUser = user => {
        this.setState({ user });
    };

    state = {
        user: { name: "lama" },
        updateUser: this.updateUser
    };

    render() {
        return (
            <UserContext.Provider value={this.state}>
                <Router>
                    <Switch>
                        <Route exact path="/" component={Login} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/chat" component={Chat} />
                    </Switch>
                </Router>
            </UserContext.Provider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
