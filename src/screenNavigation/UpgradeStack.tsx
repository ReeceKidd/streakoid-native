import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/pro-solid-svg-icons';
import { createStackNavigator } from 'react-navigation-stack';
import { UpgradeScreen } from '../screens/UpgradeScreen';
import { StreakLimitReachedScreen } from '../screens/StreakLimitReachedScreen';

const UpgradeStack = createStackNavigator(
    {
        Upgrade: UpgradeScreen,
        StreakLimitReached: StreakLimitReachedScreen,
    },
    {
        navigationOptions: {
            title: 'Upgrade',
            tabBarIcon: <FontAwesomeIcon icon={faStar} size={20} />,
        },
    },
);

export { UpgradeStack };
