import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/pro-solid-svg-icons';
import { createStackNavigator } from 'react-navigation-stack';
import { UpgradeScreen } from '../screens/UpgradeScreen';

const UpgradeStack = createStackNavigator(
    {
        Upgrade: UpgradeScreen,
    },
    {
        navigationOptions: {
            title: 'Upgrade',
            tabBarIcon: <FontAwesomeIcon icon={faStar} />,
        },
    },
);

export { UpgradeStack };
