import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { LeaderboardsScreen } from '../screens/LeaderboardsScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHelmetBattle } from '@fortawesome/pro-solid-svg-icons';
import { SoloStreakLeaderboardScreen } from '../screens/SoloStreakLeaderboardScreen';
import { TeamStreakLeaderboardScreen } from '../screens/TeamStreakLeaderboardScreen';
import { ChallengeStreakLeaderboardScreen } from '../screens/ChallengeStreakLeaderboardScreen';
import { FollowingLeaderboardScreen } from '../screens/FollowingLeaderboardScreen';
import { GlobalUserLeaderboardScreen } from '../screens/GlobalLeaderboardScreen';

const LeaderboardsStack = createStackNavigator(
    {
        Leaderboards: LeaderboardsScreen,
        FollowingLeaderboard: FollowingLeaderboardScreen,
        GlobalUserLeaderboard: GlobalUserLeaderboardScreen,
        SoloStreakLeaderboard: SoloStreakLeaderboardScreen,
        TeamStreakLeaderboard: TeamStreakLeaderboardScreen,
        ChallengeStreakLeaderboard: ChallengeStreakLeaderboardScreen,
    },
    {
        navigationOptions: {
            title: 'Leaderboards',
            tabBarIcon: <FontAwesomeIcon icon={faHelmetBattle} />,
        },
    },
);

export { LeaderboardsStack };
