/* eslint-disable react/display-name */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../screens/Screens';
import { ActivityFeedBottomTab } from './ActivityFeedBottomTab';
import { HamburgerSelector } from '../components/HamburgerSelector';
import { UsersStackScreen } from './UserStack';

export type ActivityFeedStackParamList = {
    GlobalActivity: undefined;
    FollowingActivity: undefined;
    Users: undefined;
};

const Stack = createStackNavigator<ActivityFeedStackParamList>();

const ActivityFeedBottomTabStackScreen = (
    <Stack.Screen
        name={Screens.GlobalActivity}
        options={{ title: 'Activity Feed', headerLeft: () => <HamburgerSelector /> }}
        component={ActivityFeedBottomTab}
    />
);

const ActivityFeedStack = () => (
    <Stack.Navigator>
        {ActivityFeedBottomTabStackScreen}
        {UsersStackScreen}
    </Stack.Navigator>
);

export { ActivityFeedStack };
