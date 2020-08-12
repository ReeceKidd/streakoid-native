/* eslint-disable react/display-name */
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCrown, faHelmetBattle, faRobot, faUser, faCog, faCalendarCheck } from '@fortawesome/pro-solid-svg-icons';
import { StreakBottomTab } from './StreakBottomTab';

import {
    challengeStack,
    leaderboardsStack,
    streakRecommendationsStack,
    usersStack,
    accountStack,
    upgradeStack,
} from './RootNavigator';

const Drawer = createDrawerNavigator();

export enum DrawerScreens {
    Streaks = 'Streaks',
    Landing = 'Landing',
    Upgrade = 'Upgrade',
    Challenges = 'Challenges',
    Leaderboards = 'Leaderboards',
    Recommendations = 'Recommendations',
    Users = 'Users',
    Account = 'Account',
}

const sharedDrawerOptions = [
    <Drawer.Screen
        key={DrawerScreens.Challenges}
        options={{ title: 'Challenges', drawerIcon: () => <FontAwesomeIcon icon={faCrown} />, unmountOnBlur: true }}
        name={DrawerScreens.Challenges}
        component={challengeStack}
    />,
    <Drawer.Screen
        key={DrawerScreens.Leaderboards}
        name={DrawerScreens.Leaderboards}
        options={{
            title: 'Leaderboards',
            drawerIcon: () => <FontAwesomeIcon icon={faHelmetBattle} />,
            unmountOnBlur: true,
        }}
        component={leaderboardsStack}
    />,
    <Drawer.Screen
        key={DrawerScreens.Recommendations}
        name={DrawerScreens.Recommendations}
        options={{
            title: 'Recommendations',
            drawerIcon: () => <FontAwesomeIcon icon={faRobot} />,
            unmountOnBlur: true,
        }}
        component={streakRecommendationsStack}
    />,
    <Drawer.Screen
        key={DrawerScreens.Users}
        name={DrawerScreens.Users}
        options={{ title: 'Users', drawerIcon: () => <FontAwesomeIcon icon={faUser} />, unmountOnBlur: true }}
        component={usersStack}
    />,
    <Drawer.Screen
        key={DrawerScreens.Account}
        name={DrawerScreens.Account}
        options={{ title: 'Account', drawerIcon: () => <FontAwesomeIcon icon={faCog} />, unmountOnBlur: true }}
        component={accountStack}
    />,
];

const homeDrawerScreen = (
    <Drawer.Screen
        key={DrawerScreens.Streaks}
        options={{
            drawerIcon: () => <FontAwesomeIcon icon={faCalendarCheck} />,
            title: 'Streaks',
            unmountOnBlur: true,
        }}
        name={DrawerScreens.Streaks}
        component={StreakBottomTab}
    />
);

export const getDrawerOptions = ({
    isPayingMember,
    platformIsIOS,
}: {
    isPayingMember: boolean;
    platformIsIOS: boolean;
}) => {
    if (!isPayingMember && !platformIsIOS)
        return [
            homeDrawerScreen,
            <Drawer.Screen
                key={DrawerScreens.Upgrade}
                options={{ drawerIcon: () => <FontAwesomeIcon icon={faCalendarCheck} />, unmountOnBlur: true }}
                name={DrawerScreens.Upgrade}
                component={upgradeStack}
            />,
            ...sharedDrawerOptions,
        ];

    return [homeDrawerScreen, ...sharedDrawerOptions];
};
