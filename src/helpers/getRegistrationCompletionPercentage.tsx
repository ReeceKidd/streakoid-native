import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';

export const getRegistrationCompletionPercentage = ({ currentUser }: { currentUser: PopulatedCurrentUser }): number => {
    let completionPercentage = 0;
    if (currentUser.email) {
        completionPercentage += 33.33;
    }
    if (currentUser.hasVerifiedEmail) {
        completionPercentage += 33.33;
    }
    if (currentUser.hasCustomPassword) {
        completionPercentage += 33.33;
    }
    return completionPercentage;
};
