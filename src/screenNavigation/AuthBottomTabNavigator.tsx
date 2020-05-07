import React from 'react';
import { LoginScreen } from '../screens/LoginScreen';
import { createStackNavigator } from 'react-navigation-stack';
import { ForgotPasswordScreen } from '../screens/ForgotPassword';
import { UpdatePasswordScreen } from '../screens/UpdatePasswordScreen';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSignIn, faKey } from '@fortawesome/pro-solid-svg-icons';
import { RegisterScreen } from '../screens/RegisterScreen';
import { VerifyUserScreen } from '../screens/VerifyUserScreen';

const LoginStack = createStackNavigator(
    {
        Login: LoginScreen,
        ForgotPassword: ForgotPasswordScreen,
        UpdatePassword: UpdatePasswordScreen,
    },
    {
        navigationOptions: {
            title: 'Login',
            tabBarIcon: <FontAwesomeIcon icon={faSignIn} />,
        },
    },
);

const RegisterStack = createStackNavigator(
    {
        Register: RegisterScreen,
        VerifyUser: VerifyUserScreen,
    },
    {
        navigationOptions: {
            title: 'Register',
            tabBarIcon: <FontAwesomeIcon icon={faKey} />,
        },
    },
);

const AuthBottomTabNavigator = createBottomTabNavigator({
    LoginStack: LoginStack,
    RegisterStack: RegisterStack,
});

export { AuthBottomTabNavigator };
