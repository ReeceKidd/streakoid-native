import { getSharedActions } from '@streakoid/streakoid-shared/lib';
import { unauthenticatedStreakoid } from '../api/unauthenticatedStreakoid';

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

export {
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
