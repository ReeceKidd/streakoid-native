/* eslint-disable react/display-name */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../../StackNavigator';
import { Screens } from '../screens/Screens';
import { HamburgerSelector } from '../components/HamburgerSelector';
import { StreakRecommendationsScreen } from '../screens/StreakRecommendationsScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const StreakRecommendationsStackScreen = (
    <Stack.Screen
        name={Screens.StreakRecommendations}
        component={StreakRecommendationsScreen}
        options={() => ({
            title: 'Recommendations',
            headerLeft: () => <HamburgerSelector />,
        })}
    />
);

export const StreakRecommendationsStack = () => <Stack.Navigator>{StreakRecommendationsStackScreen}</Stack.Navigator>;
