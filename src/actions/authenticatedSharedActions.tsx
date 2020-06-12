import { getSharedActions, getIdToken } from '@streakoid/streakoid-shared/lib';
import { apiUrl, authenticatedStreakoid } from '../api/authenticatedStreakoid';

const sharedActions = getSharedActions({ streakoid: authenticatedStreakoid });

const {
    emailActions,
    userActions,
    soloStreakActions,
    stripeActions,
    teamMemberStreakTaskActions,
    teamStreakActions,
    teamMemberStreakActions,
    streakRecommendationActions,
    challengeActions,
    challengeStreakActions,
    noteActions,
    activityFeedItemActions,
    leaderboardActions,
    databaseStatsActions,
} = sharedActions;

const profilePictureActions = sharedActions.profilePictureActions({
    streakoid: authenticatedStreakoid,
    getIdToken,
    apiUrl,
});
export {
    emailActions,
    userActions,
    soloStreakActions,
    stripeActions,
    teamMemberStreakTaskActions,
    teamStreakActions,
    teamMemberStreakActions,
    streakRecommendationActions,
    challengeActions,
    challengeStreakActions,
    noteActions,
    activityFeedItemActions,
    leaderboardActions,
    databaseStatsActions,
    profilePictureActions,
};
