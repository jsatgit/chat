import React from "react";
import { Input as SemanticInput } from "semantic-ui-react";

export default class Input extends React.PureComponent {
    state = {
        value: ""
    };

    onKeyPress = event => {
        if (event.key === "Enter") {
            this.submit();
        }
    };

    onChange = (event, data) => {
        this.setState({ value: data.value });
    };

    onClick = () => {
        this.submit();
    };

    submit() {
        this.props.onSubmit(this.state.value);
        this.setState({ value: "" });
    }

    getAction() {
        const { submitButtonIcon } = this.props;

        if (!submitButtonIcon) {
            return null;
        }

        return {
            onClick: this.onClick,
            icon: submitButtonIcon
        };
    }

    focus() {
        this.inputRef.focus();
    }

    componentDidUpdate(_, prevState) {
        if (this.props.forceFocus && prevState === this.state) {
            this.focus();
        }
    }

    render() {
        return (
            <SemanticInput
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                ref={inputRef => (this.inputRef = inputRef)}
                onKeyPress={this.onKeyPress}
                value={this.state.value}
                action={this.getAction()}
                placeholder={this.props.placeholder}
                onChange={this.onChange}
                fluid
            />
        );
    }
}
