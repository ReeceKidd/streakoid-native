/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { LOGOUT_SUCCESS, SESSION_EXPIRED } from '@streakoid/streakoid-shared/lib/actions/types';
import { AsyncStorage } from 'react-native';

const logoutMiddleware = (store: any) => (next: any) => async (action: AppActions) => {
    if (action.type === LOGOUT_SUCCESS) {
        AsyncStorage.clear();
    }

    if (action.type === SESSION_EXPIRED) {
        AsyncStorage.clear();
    }

    const result = next(action);
    return result;
};

export { logoutMiddleware };
