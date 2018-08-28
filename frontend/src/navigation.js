import React from 'react';

import Input from './input';
import { withContext, RoomContext } from './context';

class Navigation extends React.PureComponent {
    render() {
        const { addRoom, rooms, switchRoom } = this.props;
        return (
            <div>
                Add room <Input onSubmit={addRoom} />
                {rooms.map((room, index) => (
                    <div key={index} onClick={() => switchRoom(room)}>
                        {room.name}
                    </div>
                ))}
            </div>
        );
    }
}

export default withContext(RoomContext, Navigation);
