import React from 'react';
import { FollowingActivityScreen } from '../screens/FollowingActivityScreen';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserFriends, faGlobe } from '@fortawesome/pro-solid-svg-icons';
import { GlobalActivityScreen } from '../screens/GlobalActivityScreen';

const FollowingActivityStack = createStackNavigator(
    {
        FollowingActivity: FollowingActivityScreen,
    },
    {
        navigationOptions: {
            title: 'Following',
            tabBarIcon: <FontAwesomeIcon icon={faUserFriends} size={20} />,
        },
    },
);

const GlobalActivityStack = createStackNavigator(
    {
        GlobalActivity: GlobalActivityScreen,
    },
    {
        navigationOptions: {
            title: 'Global',
            tabBarIcon: <FontAwesomeIcon icon={faGlobe} size={20} />,
        },
    },
);

const ActivityBottomTabNavigator = createBottomTabNavigator({
    FollowingActivity: FollowingActivityStack,
    GlobalActivity: GlobalActivityStack,
});

export { ActivityBottomTabNavigator };
