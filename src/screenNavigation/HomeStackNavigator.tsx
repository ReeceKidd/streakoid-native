import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome } from '@fortawesome/pro-solid-svg-icons';

const HomeStack = createStackNavigator(
    {
        Home: HomeScreen,
    },
    {
        navigationOptions: {
            tabBarIcon: <FontAwesomeIcon icon={faHome} size={20} />,
        },
    },
);

export { HomeStack };
