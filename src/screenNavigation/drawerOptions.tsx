/* eslint-disable react/display-name */
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Screens } from '../screens/Screens';
import { ChallengesStack } from './ChallengesStack';
import { LeaderboardsStack } from './LeaderboardsStack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCrown, faHelmetBattle, faRobot, faUser, faCog, faCalendarCheck } from '@fortawesome/pro-solid-svg-icons';
import { StreakRecommendationsStack } from './StreakRecommendationsStack';
import { UsersStack } from './UserStack';
import { AccountStack } from './AccountStack';
import { StreakStack } from './StreakStack';
import { UpgradeStack } from './UpgradeStack';
import { OnboardingStack } from './OnboardingStack';

const Drawer = createDrawerNavigator();

const sharedDrawerOptions = [
    <Drawer.Screen
        key={1}
        options={{ title: 'Challenges', drawerIcon: () => <FontAwesomeIcon icon={faCrown} /> }}
        name={Screens.Challenges}
        component={ChallengesStack}
    />,
    <Drawer.Screen
        key={2}
        name={Screens.Leaderboards}
        options={{ title: 'Leaderboards', drawerIcon: () => <FontAwesomeIcon icon={faHelmetBattle} /> }}
        component={LeaderboardsStack}
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
        component={StreakRecommendationsStack}
    />,
    <Drawer.Screen
        key={5}
        name={Screens.Users}
        options={{ title: 'Users', drawerIcon: () => <FontAwesomeIcon icon={faUser} /> }}
        component={UsersStack}
    />,
    <Drawer.Screen
        key={6}
        name={Screens.Account}
        options={{ title: 'Account', drawerIcon: () => <FontAwesomeIcon icon={faCog} /> }}
        component={AccountStack}
    />,
];

const homeDrawerScreen = (
    <Drawer.Screen
        key={0}
        options={{ drawerIcon: () => <FontAwesomeIcon icon={faCalendarCheck} />, title: 'Streaks' }}
        name={Screens.Home}
        component={StreakStack}
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
                component={UpgradeStack}
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
            component={OnboardingStack}
        />,
        homeDrawerScreen,
        <Drawer.Screen
            key={0}
            options={{ drawerIcon: () => <FontAwesomeIcon icon={faCalendarCheck} /> }}
            name={Screens.Upgrade}
            component={UpgradeStack}
        />,
        ...sharedDrawerOptions,
    ];
};
