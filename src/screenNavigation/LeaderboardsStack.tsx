/* eslint-disable react/display-name */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../screens/Screens';
import { LeaderboardsScreen } from '../screens/LeaderboardsScreen';
import { HamburgerSelector } from '../components/HamburgerSelector';
import { SoloStreakLeaderboardScreen } from '../screens/SoloStreakLeaderboardScreen';
import { TeamStreakLeaderboardScreen } from '../screens/TeamStreakLeaderboardScreen';
import { ChallengeStreakLeaderboardScreen } from '../screens/ChallengeStreakLeaderboardScreen';
import { FollowingLeaderboardScreen } from '../screens/FollowingLeaderboardScreen';
import { GlobalUserLeaderboardScreen } from '../screens/GlobalLeaderboardScreen';

type LeaderboardStackParamList = {
    Leaderboards: undefined;
    SoloStreakLeaderboard: undefined;
    TeamStreakLeaderboard: undefined;
    ChallengeStreakLeaderboard: undefined;
    FollowingLeaderboard: undefined;
    GlobalUserLeaderboard: undefined;
};

const Stack = createStackNavigator<LeaderboardStackParamList>();

export const LeaderboardsStackScreen = (
    <Stack.Screen
        name={Screens.Leaderboards}
        component={LeaderboardsScreen}
        options={() => ({
            title: 'Leaderboards',
            headerLeft: () => <HamburgerSelector />,
        })}
    />
);

export const SoloStreakLeaderboardStackScreen = (
    <Stack.Screen name={Screens.SoloStreakLeaderboard} component={SoloStreakLeaderboardScreen} />
);
export const TeamStreakLeaderboardStackScreen = (
    <Stack.Screen name={Screens.TeamStreakLeaderboard} component={TeamStreakLeaderboardScreen} />
);
export const ChallengeStreakLeaderboardStackScreen = (
    <Stack.Screen name={Screens.ChallengeStreakLeaderboard} component={ChallengeStreakLeaderboardScreen} />
);
export const FollowingLeaderboardStackScreen = (
    <Stack.Screen name={Screens.FollowingLeaderboard} component={FollowingLeaderboardScreen} />
);
export const GlobalUserLeaderboardStackScreen = (
    <Stack.Screen name={Screens.GlobalUserLeaderboard} component={GlobalUserLeaderboardScreen} />
);

export const LeaderboardsStack = () => (
    <Stack.Navigator>
        {LeaderboardsStackScreen}
        {SoloStreakLeaderboardStackScreen}
        {TeamStreakLeaderboardStackScreen}
        {ChallengeStreakLeaderboardStackScreen}
        {FollowingLeaderboardStackScreen}
        {GlobalUserLeaderboardStackScreen}
    </Stack.Navigator>
);
