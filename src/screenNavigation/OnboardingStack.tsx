/* eslint-disable react/display-name */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../screens/Screens';
import { LandingScreen } from '../screens/LandingScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { UpdatePasswordScreen } from '../screens/UpdatePasswordScreen';
import { MadeAnAccountScreen } from '../screens/onboarding/MadeAnAccountScreen';
import { ChooseAPathScreen } from '../screens/onboarding/ChooseAPathScreen';

export type OnboardingStackParamList = {
    Landing: undefined;
    MadeAnAccount: undefined;
    ChooseAPath: undefined;
    Login: undefined;
    ForgotPassword: undefined;
    UpdatePassword: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

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

const ChooseAPathStackScreen = (
    <Stack.Screen name={Screens.ChooseAPath} options={{ headerShown: false }} component={ChooseAPathScreen} />
);

const ForgotPasswordStackScreen = <Stack.Screen name={Screens.ForgotPassword} component={ForgotPasswordScreen} />;

const LoginStackScreen = <Stack.Screen name={Screens.Login} options={{ headerShown: false }} component={LoginScreen} />;

const UpdatePasswordStackScreen = <Stack.Screen name={Screens.UpdatePassword} component={UpdatePasswordScreen} />;

const OnboardingStack = () => (
    <Stack.Navigator>
        {LandingStackScreen}
        {MadeAnAccountStackScreen}
        {ChooseAPathStackScreen}
        {ForgotPasswordStackScreen}
        {LoginStackScreen}
        {UpdatePasswordStackScreen}
    </Stack.Navigator>
);

export { OnboardingStack };
