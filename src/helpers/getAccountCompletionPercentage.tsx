import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';

export const getAccountCompletionPercentage = ({ currentUser }: { currentUser: PopulatedCurrentUser }): number => {
    let completionPercentage = 0;
    if (currentUser.firstName) {
        completionPercentage += 20;
    }
    if (currentUser.lastName) {
        completionPercentage += 20;
    }
    if (currentUser.onboarding && currentUser.onboarding.whyDoYouWantToBuildNewHabitsChoice) {
        completionPercentage += 20;
    }
    if (currentUser.hasUsernameBeenCustomized) {
        completionPercentage += 20;
    }
    if (currentUser.hasProfileImageBeenCustomized) {
        completionPercentage += 20;
    }
    return completionPercentage;
};
