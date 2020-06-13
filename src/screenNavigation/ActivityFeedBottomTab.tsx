/* eslint-disable react/display-name */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Screens } from '../screens/Screens';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserFriends, faGlobe } from '@fortawesome/pro-solid-svg-icons';
import { followingActivityFeedStack, globalActivityFeedStack } from './RootNavigator';

export type ActivityFeedTabParamList = {
    FollowingActivity: undefined;
    GlobalActivity: undefined;
};

const Tab = createBottomTabNavigator<ActivityFeedTabParamList>();

export const FollowingActivityTabScreen = (
    <Tab.Screen
        name={Screens.FollowingActivity}
        component={followingActivityFeedStack}
        options={() => ({
            title: 'Following',
            tabBarIcon: () => <FontAwesomeIcon icon={faUserFriends} />,
        })}
    />
);

export const GlobalActivityTabScreen = (
    <Tab.Screen
        name={Screens.GlobalActivity}
        component={globalActivityFeedStack}
        options={() => ({
            title: 'Global',
            tabBarIcon: () => <FontAwesomeIcon icon={faGlobe} />,
        })}
    />
);

export const ActivityFeedBottomTab = () => (
    <Tab.Navigator>
        {FollowingActivityTabScreen}
        {GlobalActivityTabScreen}
    </Tab.Navigator>
);
