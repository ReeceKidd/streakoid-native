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
            drawerIcon: <FontAwesomeIcon icon={faHome} />,
        },
    },
    Upgrade: {
        screen: UpgradeStack,
        navigationOptions: {
            drawerIcon: (
                <FontAwesomeIcon
                    icon={faStar}
                    style={{
                        backgroundColor: 'black',
                        color: 'yellow',
                        borderRadius: 100,
                        width: 50,
                        height: 50,
                        padding: 10,
                    }}
                />
            ),
        },
    },
    ...drawerOptions,
});

const FreeMemberIosDrawer = createDrawerNavigator({
    Home: {
        screen: HomeStack,
        navigationOptions: {
            drawerIcon: <FontAwesomeIcon icon={faHome} />,
        },
    },
    ...drawerOptions,
});

const FreeMemberDrawer = Platform.OS === 'ios' ? FreeMemberIosDrawer : FreeMemberAndroidDrawer;

export { FreeMemberDrawer };
