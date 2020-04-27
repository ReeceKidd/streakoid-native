import { getSharedActions, getIdToken } from '@streakoid/streakoid-shared/lib';
import streakoid from '../api/streakoid';
import { apiUrl } from '../api/streakoid';
import { auth } from './authActions';
import { streakoidRegistration } from '../api/registration';

const sharedActions = getSharedActions(streakoid);

const {
    emailActions,
    soloStreakActions,
    stripeActions,
    teamMemberStreakTaskActions,
    teamStreakActions,
    userActions,
    streakRecommendationActions,
    challengeActions,
    challengeStreakActions,
    activityFeedItemActions,
    noteActions,
    leaderboardActions,
    teamMemberStreakActions,
} = sharedActions;

const authActions = auth(streakoid, streakoidRegistration);
const profilePictureActions = sharedActions.profilePictureActions(apiUrl, getIdToken);

export {
    authActions,
    emailActions,
    soloStreakActions,
    stripeActions,
    teamMemberStreakTaskActions,
    teamStreakActions,
    userActions,
    profilePictureActions,
    streakRecommendationActions,
    challengeActions,
    challengeStreakActions,
    activityFeedItemActions,
    noteActions,
    leaderboardActions,
    teamMemberStreakActions,
};
