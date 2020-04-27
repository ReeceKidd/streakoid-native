/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppActions } from '@streakoid/streakoid-shared/lib';
import {
    NAVIGATE_TO_HOME,
    NAVIGATE_TO_VERIFY_USER,
    NAVIGATE_TO_LOGIN,
    NAVIGATE_TO_UPDATE_PASSWORD,
    NAVIGATE_TO_SOLO_STREAKS,
    NAVIGATE_TO_SPECIFIC_SOLO_STREAK,
    NAVIGATE_TO_THANK_YOU,
    NAVIGATE_TO_TEAM_STREAKS,
    NAVIGATE_TO_SPECIFIC_TEAM_STREAK,
    NAVIGATE_TO_CHALLENGE_STREAKS,
    NAVIGATE_TO_SPECIFIC_CHALLENGE_STREAK,
    NAVIGATE_TO_WELCOME,
    NAVIGATE_TO_STREAK_LIMIT_REACHED,
} from '@streakoid/streakoid-shared/lib/actions/types';
import { Screens } from '../screens/Screens';
import NavigationService from '../screens/NavigationService';

const navigationMiddleware = (store: any) => (next: any) => (action: AppActions) => {
    switch (action.type) {
        case NAVIGATE_TO_HOME:
            return NavigationService.navigate(Screens.Home);

        case NAVIGATE_TO_VERIFY_USER:
            return NavigationService.navigate(Screens.VerifyUser);

        case NAVIGATE_TO_LOGIN:
            return NavigationService.navigate(Screens.Login);

        case NAVIGATE_TO_UPDATE_PASSWORD:
            return NavigationService.navigate(Screens.UpdatePassword);

        case NAVIGATE_TO_SOLO_STREAKS:
            return NavigationService.navigate(Screens.SoloStreaks);

        case NAVIGATE_TO_SPECIFIC_SOLO_STREAK:
            return NavigationService.navigate(Screens.SoloStreakInfo, { _id: action.payload });

        case NAVIGATE_TO_THANK_YOU:
            return NavigationService.navigate(Screens.ThankYouPage);

        case NAVIGATE_TO_TEAM_STREAKS:
            return NavigationService.navigate(Screens.TeamStreaks);

        case NAVIGATE_TO_SPECIFIC_TEAM_STREAK:
            return NavigationService.navigate(Screens.TeamStreakInfo, { _id: action.payload });

        case NAVIGATE_TO_CHALLENGE_STREAKS:
            return NavigationService.navigate(Screens.ChallengeStreaks);

        case NAVIGATE_TO_SPECIFIC_CHALLENGE_STREAK:
            return NavigationService.navigate(Screens.ChallengeStreakInfo, { _id: action.payload });

        case NAVIGATE_TO_WELCOME:
            return NavigationService.navigate(Screens.Welcome);

        case NAVIGATE_TO_STREAK_LIMIT_REACHED:
            return NavigationService.navigate(Screens.StreakLimitReached);
    }

    const result = next(action);
    return result;
};

export { navigationMiddleware };
