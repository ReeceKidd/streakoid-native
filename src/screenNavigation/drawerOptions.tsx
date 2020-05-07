import React from 'react';
import { SoloStreakStack } from './SoloStreakStack';
import { TeamStreakStack } from './TeamStreaksStack';
import { ChallengeStreakStack } from './ChallengeStreaksStack';
import { ChallengesStack } from './ChallengesStack';
import { StreakRecommendationsStack } from './StreakRecommendationsStack';
import { UserStack } from './UserStack';
import { AccountStack } from './AccountStack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faChild,
    faPeopleCarry,
    faMedal,
    faCrown,
    faHelmetBattle,
    faUserFriends,
    faRobot,
    faUser,
    faMailBulk,
    faCog,
} from '@fortawesome/pro-solid-svg-icons';
import { ActivityBottomTabNavigator } from './ActivityFeedStack';
import { LeaderboardsStack } from './LeaderboardsStack';
import { FeedbackStack } from './FeedbackStack';

export const drawerOptions = {
    SoloStreaks: {
        screen: SoloStreakStack,
        navigationOptions: {
            drawerIcon: <FontAwesomeIcon icon={faChild} />,
        },
    },
    TeamStreaks: {
        screen: TeamStreakStack,
        navigationOptions: {
            drawerIcon: <FontAwesomeIcon icon={faPeopleCarry} />,
        },
    },
    ChallengeStreaks: {
        screen: ChallengeStreakStack,
        navigationOptions: {
            drawerIcon: <FontAwesomeIcon icon={faMedal} />,
        },
    },
    Challenges: {
        screen: ChallengesStack,
        navigationOptions: {
            title: 'Challenges',
            drawerIcon: <FontAwesomeIcon icon={faCrown} />,
        },
    },
    Leaderboards: {
        screen: LeaderboardsStack,
        navigationOptions: {
            title: 'Leaderboards',
            drawerIcon: <FontAwesomeIcon icon={faHelmetBattle} />,
        },
    },
    ActivityFeed: {
        screen: ActivityBottomTabNavigator,
        navigationOptions: {
            title: 'Activity Feed',
            drawerIcon: <FontAwesomeIcon icon={faUserFriends} />,
        },
    },
    StreakRecommendations: {
        screen: StreakRecommendationsStack,
        navigationOptions: {
            title: 'Streak Recommendations',
            drawerIcon: <FontAwesomeIcon icon={faRobot} />,
        },
    },
    Users: {
        screen: UserStack,
        navigationOptions: {
            drawerIcon: <FontAwesomeIcon icon={faUser} />,
        },
    },
    Feedback: {
        screen: FeedbackStack,
        navigationOptions: {
            drawerIcon: <FontAwesomeIcon icon={faMailBulk} />,
        },
    },
    Account: {
        screen: AccountStack,
        navigationOptions: {
            drawerIcon: <FontAwesomeIcon icon={faCog} />,
        },
    },
};
