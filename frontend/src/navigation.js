import React from 'react';

import Input from './input';
import Context from './context';

export default class Navigation extends React.PureComponent {
    render() {
        return (
            <Context.Consumer>
                {({addRoom, switchRoom}) => (
                    <div>
                        Add room <Input onSubmit={addRoom} />
                        {this.props.rooms.map((room, index) => (
                            <div key={index} onClick={() => switchRoom(room)}>
                                {room.name}
                            </div>
                        ))}
                    </div>
                )}
            </Context.Consumer>
        );
    }
}
