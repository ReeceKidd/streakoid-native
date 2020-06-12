/* eslint-disable react/display-name */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../screens/Screens';
import { HamburgerSelector } from '../components/HamburgerSelector';
import { UpgradeScreen } from '../screens/UpgradeScreen';

export type UpgradeParamList = {
    Upgrade: undefined;
};

const Stack = createStackNavigator<UpgradeParamList>();

const UpgradeStackScreen = (
    <Stack.Screen
        name={Screens.Upgrade}
        component={UpgradeScreen}
        options={() => ({
            title: 'Upgrade',
            headerLeft: () => <HamburgerSelector />,
        })}
    />
);

export const UpgradeStack = () => <Stack.Navigator>{UpgradeStackScreen}</Stack.Navigator>;
