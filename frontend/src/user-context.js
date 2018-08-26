import React from 'react';

const Context = React.createContext();

export default Context;

export function withUserContext(Component) {
    return function UserContextComponent(props) {
        return (
            <Context.Consumer>
                {userContext => <Component {...props} {...userContext} />}
            </Context.Consumer>
        )
    }
}
