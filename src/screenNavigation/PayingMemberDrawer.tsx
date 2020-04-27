import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome } from '@fortawesome/pro-solid-svg-icons';
import { HomeStack } from './HomeStackNavigator';
import { drawerOptions } from './drawerOptions';

const PayingMemberDrawer = createDrawerNavigator({
    Home: {
        screen: HomeStack,
        navigationOptions: {
            drawerIcon: <FontAwesomeIcon icon={faHome} size={20} />,
        },
    },
    ...drawerOptions,
});

export { PayingMemberDrawer };
