import React from "react";

export const UserContext = React.createContext();
export const ChatContext = React.createContext();
export const RoomContext = React.createContext();

export function withContext(Context, Component) {
    return function ContextComponent(props) {
        return (
            <Context.Consumer>
                {value => <Component {...props} {...value} />}
            </Context.Consumer>
        );
    };
}
