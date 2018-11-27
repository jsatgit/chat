import React, { Component } from "react";
import { SafeAreaView, Text  } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { StackActions, NavigationActions } from 'react-navigation';

GoogleSignin.configure({
    iosClientId: "320665311927-gl1199l0i8fcgsg3qa351bcd6fjrkmi1.apps.googleusercontent.com"
});

export default class LoginScreen extends Component {
    state = {
        showLogin: false
    }

    goHome(user) {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Home', params: {user}})],
        });
        this.props.navigation.dispatch(resetAction);

    }

    signIn = async () => {
        try {
            const userInfo = await GoogleSignin.signIn();
            const { user } = userInfo;
            this.goHome(user)
        } catch(err) {
            console.error(err);
        }
    }

    async componentDidMount() {
        try {
            const isSignedIn = await GoogleSignin.isSignedIn();
            if (isSignedIn) {
                const userInfo = await GoogleSignin.signInSilently();
                const { user } = userInfo;
                this.goHome(user)
            } else {
                this.setState({showLogin: true})
            }
        } catch(err) {
            console.error(err);
        }

    }

    render() {
        const { shouldShowLogin } = this.state;

        return (
            <SafeAreaView style={{ flex: 1 }}>
                { 
                    shouldShowLogin && 
                    <GoogleSigninButton
                        style={{ height: 48 }}
                        size={GoogleSigninButton.Size.Standard}
                        color={GoogleSigninButton.Color.Light}
                        onPress={this.signIn}
                    />
                }
            </SafeAreaView>
        );
    }
}
