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
            drawerIcon: <FontAwesomeIcon icon={faChild} size={20} />,
        },
    },
    TeamStreaks: {
        screen: TeamStreakStack,
        navigationOptions: {
            drawerIcon: <FontAwesomeIcon icon={faPeopleCarry} size={20} />,
        },
    },
    ChallengeStreaks: {
        screen: ChallengeStreakStack,
        navigationOptions: {
            drawerIcon: <FontAwesomeIcon icon={faMedal} size={20} />,
        },
    },
    Challenges: {
        screen: ChallengesStack,
        navigationOptions: {
            title: 'Challenges',
            drawerIcon: <FontAwesomeIcon icon={faCrown} size={20} />,
        },
    },
    Leaderboards: {
        screen: LeaderboardsStack,
        navigationOptions: {
            title: 'Leaderboards',
            drawerIcon: <FontAwesomeIcon icon={faHelmetBattle} size={20} />,
        },
    },
    ActivityFeed: {
        screen: ActivityBottomTabNavigator,
        navigationOptions: {
            title: 'Activity Feed',
            drawerIcon: <FontAwesomeIcon icon={faUserFriends} size={20} />,
        },
    },
    StreakRecommendations: {
        screen: StreakRecommendationsStack,
        navigationOptions: {
            title: 'Streak Recommendations',
            drawerIcon: <FontAwesomeIcon icon={faRobot} size={20} />,
        },
    },
    Users: {
        screen: UserStack,
        navigationOptions: {
            drawerIcon: <FontAwesomeIcon icon={faUser} size={20} />,
        },
    },
    Feedback: {
        screen: FeedbackStack,
        navigationOptions: {
            drawerIcon: <FontAwesomeIcon icon={faMailBulk} size={20} />,
        },
    },
    Account: {
        screen: AccountStack,
        navigationOptions: {
            drawerIcon: <FontAwesomeIcon icon={faCog} size={20} />,
        },
    },
};
