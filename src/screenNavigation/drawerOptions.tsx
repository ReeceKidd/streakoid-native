/* eslint-disable react/display-name */
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCrown, faHelmetBattle, faRobot, faUser, faCog, faCalendarCheck } from '@fortawesome/pro-solid-svg-icons';
import { StreakBottomTab } from './StreakBottomTab';

import { Screens } from '../screens/Screens';
import {
    challengeStack,
    leaderboardsStack,
    streakRecommendationsStack,
    usersStack,
    accountStack,
    upgradeStack,
    landingStack,
} from './RootNavigator';

const Drawer = createDrawerNavigator();

const sharedDrawerOptions = [
    <Drawer.Screen
        key={1}
        options={{ title: 'Challenges', drawerIcon: () => <FontAwesomeIcon icon={faCrown} /> }}
        name={Screens.Challenges}
        component={challengeStack}
    />,
    <Drawer.Screen
        key={2}
        name={Screens.Leaderboards}
        options={{ title: 'Leaderboards', drawerIcon: () => <FontAwesomeIcon icon={faHelmetBattle} /> }}
        component={leaderboardsStack}
    />,
    // <Drawer.Screen
    //     key={3}
    //     name={Screens.GlobalActivity}
    //     options={{ title: 'Activity Feed', drawerIcon: () => <FontAwesomeIcon icon={faUserFriends} /> }}
    //     component={ActivityFeedStack}
    // />,
    <Drawer.Screen
        key={4}
        name={Screens.StreakRecommendations}
        options={{ title: 'Recommendations', drawerIcon: () => <FontAwesomeIcon icon={faRobot} /> }}
        component={streakRecommendationsStack}
    />,
    <Drawer.Screen
        key={5}
        name={Screens.Users}
        options={{ title: 'Users', drawerIcon: () => <FontAwesomeIcon icon={faUser} /> }}
        component={usersStack}
    />,
    <Drawer.Screen
        key={6}
        name={Screens.Account}
        options={{ title: 'Account', drawerIcon: () => <FontAwesomeIcon icon={faCog} /> }}
        component={accountStack}
    />,
];

const homeDrawerScreen = (
    <Drawer.Screen
        key={0}
        options={{ drawerIcon: () => <FontAwesomeIcon icon={faCalendarCheck} />, title: 'Streaks' }}
        name={Screens.Home}
        component={StreakBottomTab}
    />
);

export const getDrawerOptions = ({
    isAuthenticated,
    isPayingMember,
}: {
    isAuthenticated: boolean;
    isPayingMember: boolean;
}) => {
    if (isAuthenticated && !isPayingMember)
        return [
            homeDrawerScreen,
            <Drawer.Screen
                key={0}
                options={{ drawerIcon: () => <FontAwesomeIcon icon={faCalendarCheck} /> }}
                name={Screens.Upgrade}
                component={upgradeStack}
            />,
            ...sharedDrawerOptions,
        ];
    if (isAuthenticated && isPayingMember) {
        return [homeDrawerScreen, ...sharedDrawerOptions];
    }
    return [
        <Drawer.Screen
            key={0}
            options={{ drawerIcon: () => null, title: undefined, drawerLabel: () => null }}
            name={Screens.Landing}
            component={landingStack}
        />,
        homeDrawerScreen,
        <Drawer.Screen
            key={0}
            options={{ drawerIcon: () => <FontAwesomeIcon icon={faCalendarCheck} /> }}
            name={Screens.Upgrade}
            component={upgradeStack}
        />,
        ...sharedDrawerOptions,
    ];
};
