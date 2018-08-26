import React from 'react';

export default class Input extends React.PureComponent {
    onKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.props.onSubmit(event.target.value);
            this.inputElement.value = '';
        }
    }

    render() {
        return <input ref={element => this.inputElement = element} onKeyPress={this.onKeyPress} />;
    }
}
