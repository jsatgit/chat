import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";

import HomeScreen from "./home-screen";
import ConversationScreen from "./conversation-screen";
import LoginScreen from "./login-screen";

const AppNavigator = createStackNavigator({
    Login: LoginScreen,
    Home: HomeScreen,
    Conversation: ConversationScreen 
});

export default createAppContainer(AppNavigator);
