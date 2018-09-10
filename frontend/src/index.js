import "babel-polyfill";
import "semantic-ui-css/semantic.min.css";
import React from "react";
import ReactDOM from "react-dom";

import Login from "./login";
import { UserContext } from "./context";

class App extends React.PureComponent {
    updateUser = user => {
        this.setState({ user });
    };

    state = {
        user: { name: null },
        updateUser: this.updateUser
    };

    render() {
        return (
            <UserContext.Provider value={this.state}>
                <Login />
            </UserContext.Provider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
