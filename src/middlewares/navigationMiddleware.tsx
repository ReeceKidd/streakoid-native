/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppActions } from '@streakoid/streakoid-shared/lib';
import {
    NAVIGATE_TO_HOME,
    NAVIGATE_TO_LOGIN,
    NAVIGATE_TO_UPDATE_PASSWORD,
    NAVIGATE_TO_SPECIFIC_SOLO_STREAK,
    NAVIGATE_TO_SPECIFIC_TEAM_STREAK,
    NAVIGATE_TO_SPECIFIC_CHALLENGE_STREAK,
    NAVIGATE_TO_WELCOME,
    NAVIGATE_TO_STREAK_LIMIT_REACHED,
    NAVIGATE_TO_CHOOSE_PASSWORD,
    NAVIGATE_TO_CHOOSE_A_PROFILE_PICTURE,
    NAVIGATE_TO_COMPLETED_REGISTRATION,
    NAVIGATE_TO_VERIFY_EMAIL,
    NAVIGATE_TO_ADD_TEAM_MEMBER,
} from '@streakoid/streakoid-shared/lib/actions/types';
import { Screens } from '../screens/Screens';
import { NavigationService } from '../../NavigationService';

const navigationMiddleware = (store: any) => (next: any) => (action: AppActions) => {
    switch (action.type) {
        case NAVIGATE_TO_HOME:
            return NavigationService.navigate({ screen: Screens.Home });

        case NAVIGATE_TO_LOGIN:
            return NavigationService.navigate({ screen: Screens.Login });

        case NAVIGATE_TO_UPDATE_PASSWORD:
            return NavigationService.navigate({ screen: Screens.UpdatePassword });

        case NAVIGATE_TO_SPECIFIC_SOLO_STREAK:
            return NavigationService.navigate({ screen: Screens.SoloStreakInfo, params: { _id: action.payload } });

        case NAVIGATE_TO_SPECIFIC_TEAM_STREAK:
            return NavigationService.navigate({ screen: Screens.TeamStreakInfo, params: { _id: action.payload } });

        case NAVIGATE_TO_SPECIFIC_CHALLENGE_STREAK:
            return NavigationService.navigate({ screen: Screens.ChallengeStreakInfo, params: { _id: action.payload } });

        case NAVIGATE_TO_WELCOME:
            return NavigationService.navigate({ screen: Screens.Welcome });

        case NAVIGATE_TO_STREAK_LIMIT_REACHED:
            return NavigationService.navigate({ screen: Screens.Upgrade });

        case NAVIGATE_TO_CHOOSE_PASSWORD:
            return NavigationService.navigate({ screen: Screens.ChooseAPassword });

        case NAVIGATE_TO_CHOOSE_A_PROFILE_PICTURE:
            return NavigationService.navigate({ screen: Screens.ChooseAProfilePicture });

        case NAVIGATE_TO_COMPLETED_REGISTRATION:
            return NavigationService.navigate({ screen: Screens.CompletedRegistration });

        case NAVIGATE_TO_VERIFY_EMAIL:
            return NavigationService.navigate({ screen: Screens.VerifyEmail });

        case NAVIGATE_TO_ADD_TEAM_MEMBER:
            return NavigationService.navigate({
                screen: Screens.AddUserToTeamStreak,
                params: { teamStreakId: action.payload.teamStreakId },
            });
    }

    const result = next(action);
    return result;
};

export { navigationMiddleware };
