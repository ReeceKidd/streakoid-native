import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/pro-solid-svg-icons';
import { UsersScreen } from '../screens/UsersScreen';
import { UserProfileScreen } from '../screens/UserProfileScreen';

const UserStack = createStackNavigator(
    {
        Users: UsersScreen,
        UserProfile: UserProfileScreen,
    },
    {
        navigationOptions: {
            title: 'Users',
            tabBarIcon: <FontAwesomeIcon icon={faUser} />,
        },
    },
);

export { UserStack };
