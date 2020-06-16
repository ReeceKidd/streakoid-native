import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../screens/Screens';
import { LandingScreen } from '../screens/LandingScreen';
import { MadeAnAccountScreen } from '../screens/onboarding/MadeAnAccountScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { UpdatePasswordScreen } from '../screens/UpdatePasswordScreen';

export type UnauthenticatedStackParamList = {
    [Screens.Landing]: undefined;
    [Screens.MadeAnAccount]: undefined;
    [Screens.ChooseAPath]: undefined;
    [Screens.Login]: undefined;
    [Screens.ForgotPassword]: undefined;
    [Screens.UpdatePassword]: undefined;
};

const Stack = createStackNavigator<UnauthenticatedStackParamList>();

const LandingStackScreen = (
    <Stack.Screen name={Screens.Landing} options={{ headerShown: false }} component={LandingScreen} />
);

const MadeAnAccountStackScreen = (
    <Stack.Screen
        name={Screens.MadeAnAccount}
        options={{ title: 'Your temporary account', headerLeft: () => null }}
        component={MadeAnAccountScreen}
    />
);

const ForgotPasswordStackScreen = <Stack.Screen name={Screens.ForgotPassword} component={ForgotPasswordScreen} />;

const LoginStackScreen = <Stack.Screen name={Screens.Login} options={{ headerShown: false }} component={LoginScreen} />;

const UpdatePasswordStackScreen = <Stack.Screen name={Screens.UpdatePassword} component={UpdatePasswordScreen} />;

export const UnauthenticatedStackNavigator = () => (
    <Stack.Navigator initialRouteName={Screens.Landing}>
        {LandingStackScreen}
        {MadeAnAccountStackScreen}
        {ForgotPasswordStackScreen}
        {LoginStackScreen}
        {UpdatePasswordStackScreen}
    </Stack.Navigator>
);
