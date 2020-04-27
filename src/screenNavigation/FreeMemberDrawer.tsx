import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faStar } from '@fortawesome/pro-solid-svg-icons';
import { HomeStack } from './HomeStackNavigator';
import { Platform } from 'react-native';
import { UpgradeStack } from './UpgradeStack';
import { drawerOptions } from './drawerOptions';

const FreeMemberAndroidDrawer = createDrawerNavigator({
    Home: {
        screen: HomeStack,
        navigationOptions: {
            drawerIcon: <FontAwesomeIcon icon={faHome} size={20} />,
        },
    },
    Upgrade: {
        screen: UpgradeStack,
        navigationOptions: {
            drawerIcon: <FontAwesomeIcon icon={faStar} size={20} style={{ backgroundColor: 'yellow' }} />,
        },
    },
    ...drawerOptions,
});

const FreeMemberIosDrawer = createDrawerNavigator({
    Home: {
        screen: HomeStack,
        navigationOptions: {
            drawerIcon: <FontAwesomeIcon icon={faHome} size={20} />,
        },
    },
    ...drawerOptions,
});

const FreeMemberDrawer = Platform.OS === 'ios' ? FreeMemberIosDrawer : FreeMemberAndroidDrawer;

export { FreeMemberDrawer };
