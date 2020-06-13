import { getAuthActions } from '@streakoid/streakoid-shared/lib';
import { unauthenticatedStreakoid } from '../api/unauthenticatedStreakoid';
import { awsCognitoAuth } from '../awsCongitoAuth';
import { authenticatedStreakoid } from '../api/authenticatedStreakoid';

export const authActions = getAuthActions({
    unauthenticatedStreakoid,
    authenticatedStreakoid,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    auth: awsCognitoAuth as any,
});
