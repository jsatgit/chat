import React from 'react';

import Input from './input';
import Context from './context';
import UserContext from './user-context';

export default class Footer extends React.PureComponent {
    render() {
        return (
            <UserContext.Consumer>
                {({user}) => (
                    <div>
                        {user &&
                            <Context.Consumer>
                                {({addMessage}) => (
                                    <div>
                                        {user.name}: <Input onSubmit={(message) => addMessage(message, user.name)} />
                                    </div>
                                )}
                            </Context.Consumer>
                        }
                    </div>
                )}
            </UserContext.Consumer>
        );
    }
}
