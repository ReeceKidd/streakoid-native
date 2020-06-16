/* eslint-disable react/display-name */
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faCrown,
    faHelmetBattle,
    faRobot,
    faUser,
    faCog,
    faCalendarCheck,
    faUserFriends,
} from '@fortawesome/pro-solid-svg-icons';
import { StreakBottomTab } from './StreakBottomTab';

import {
    challengeStack,
    leaderboardsStack,
    streakRecommendationsStack,
    usersStack,
    accountStack,
    upgradeStack,
} from './RootNavigator';
import { ActivityFeedBottomTab } from './ActivityFeedBottomTab';

const Drawer = createDrawerNavigator();

export enum DrawerScreens {
    Streaks = 'Streaks',
    Landing = 'Landing',
    Upgrade = 'Upgrade',
    Challenges = 'Challenges',
    Leaderboards = 'Leaderboards',
    ActivityFeed = 'ActivityFeed',
    Recommendations = 'Recommendations',
    Users = 'Users',
    Account = 'Account',
}

const sharedDrawerOptions = [
    <Drawer.Screen
        key={DrawerScreens.Challenges}
        options={{ title: 'Challenges', drawerIcon: () => <FontAwesomeIcon icon={faCrown} /> }}
        name={DrawerScreens.Challenges}
        component={challengeStack}
    />,
    <Drawer.Screen
        key={DrawerScreens.Leaderboards}
        name={DrawerScreens.Leaderboards}
        options={{ title: 'Leaderboards', drawerIcon: () => <FontAwesomeIcon icon={faHelmetBattle} /> }}
        component={leaderboardsStack}
    />,
    <Drawer.Screen
        key={DrawerScreens.ActivityFeed}
        name={DrawerScreens.ActivityFeed}
        options={{ title: 'Activity Feed', drawerIcon: () => <FontAwesomeIcon icon={faUserFriends} /> }}
        component={ActivityFeedBottomTab}
    />,
    <Drawer.Screen
        key={DrawerScreens.Recommendations}
        name={DrawerScreens.Recommendations}
        options={{ title: 'Recommendations', drawerIcon: () => <FontAwesomeIcon icon={faRobot} /> }}
        component={streakRecommendationsStack}
    />,
    <Drawer.Screen
        key={DrawerScreens.Users}
        name={DrawerScreens.Users}
        options={{ title: 'Users', drawerIcon: () => <FontAwesomeIcon icon={faUser} /> }}
        component={usersStack}
    />,
    <Drawer.Screen
        key={DrawerScreens.Account}
        name={DrawerScreens.Account}
        options={{ title: 'Account', drawerIcon: () => <FontAwesomeIcon icon={faCog} /> }}
        component={accountStack}
    />,
];

const homeDrawerScreen = (
    <Drawer.Screen
        key={DrawerScreens.Streaks}
        options={{ drawerIcon: () => <FontAwesomeIcon icon={faCalendarCheck} />, title: 'Streaks' }}
        name={DrawerScreens.Streaks}
        component={StreakBottomTab}
    />
);

export const getDrawerOptions = ({ isPayingMember }: { isPayingMember: boolean }) => {
    if (!isPayingMember)
        return [
            homeDrawerScreen,
            <Drawer.Screen
                key={DrawerScreens.Upgrade}
                options={{ drawerIcon: () => <FontAwesomeIcon icon={faCalendarCheck} /> }}
                name={DrawerScreens.Upgrade}
                component={upgradeStack}
            />,
            ...sharedDrawerOptions,
        ];

    return [homeDrawerScreen, ...sharedDrawerOptions];
};
