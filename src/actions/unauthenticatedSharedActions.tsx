import { getSharedActions } from '@streakoid/streakoid-shared/lib';
import { unauthenticatedStreakoid } from '../api/unauthenticatedStreakoid';
import { awsCognitoAuth } from '../awsCongitoAuth';

const sharedActions = getSharedActions({ streakoid: unauthenticatedStreakoid });

const {
    userActions,
    soloStreakActions,
    teamMemberStreakTaskActions,
    teamStreakActions,
    teamMemberStreakActions,
    streakRecommendationActions,
    challengeActions,
    challengeStreakActions,
    activityFeedItemActions,
    leaderboardActions,
    databaseStatsActions,
} = sharedActions;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authActions = sharedActions.authActions({ streakoid: unauthenticatedStreakoid, auth: awsCognitoAuth as any });

export {
    authActions,
    userActions,
    soloStreakActions,
    teamMemberStreakTaskActions,
    teamStreakActions,
    teamMemberStreakActions,
    streakRecommendationActions,
    challengeActions,
    challengeStreakActions,
    activityFeedItemActions,
    leaderboardActions,
    databaseStatsActions,
};
