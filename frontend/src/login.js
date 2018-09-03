import React from "react";
import { GoogleLogin } from "react-google-login";
import { Redirect } from "react-router";
import Cookies from "js-cookie";
import { Header } from "semantic-ui-react";
import styled from "styled-components";

import { post } from "./api";
import { withContext, UserContext } from "./context";

const Container = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

class Login extends React.PureComponent {
    state = {
        status: "loading"
    };

    onLogin = async (googleUser, updateUser) => {
        const token = googleUser.getAuthResponse().id_token;
        this.authenticate(token);
    };

    async authenticate(token) {
        const response = await post("/api/login", { token });
        if (response.ok) {
            const user = await response.json();
            Cookies.set("chat-token", token, { expires: 1 });
            this.props.updateUser(user);
            this.setState({ status: "authenticated" });
        } else if (response.status === 401) {
            this.setState({ status: "login" });
        }
    }

    componentDidMount() {
        const token = Cookies.get("chat-token");
        if (token) {
            this.authenticate(token);
        } else {
            this.setState({ status: "login" });
        }
    }

    render() {
        switch (this.state.status) {
            case "login":
                return (
                    <Container>
                        <div>
                            <Header as="h1">Welcome to Chat</Header>
                            <GoogleLogin
                                className="ui primary button"
                                clientId="320665311927-28nv44ac7jfmbf3g4sejkt616c6gtqms.apps.googleusercontent.com"
                                buttonText="Login"
                                onSuccess={googleUser =>
                                    this.onLogin(googleUser)
                                }
                                onFailure={console.error}
                            />
                        </div>
                    </Container>
                );
            case "authenticated":
                return <Redirect to="/chat" />;
            default:
                return null;
        }
    }
}

export default withContext(UserContext, Login);
