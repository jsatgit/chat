import React from 'react';

import Input from './input';
import { withContext, ChatContext, UserContext } from './context';

class Footer extends React.PureComponent {
    render() {
        const { user, addMessage } = this.props;
        return (
            <div>
                {user.name}: <Input onSubmit={(message) => addMessage(message, user.name)} />
            </div>
        );
    }
}

export default withContext(UserContext, withContext(ChatContext, Footer));
