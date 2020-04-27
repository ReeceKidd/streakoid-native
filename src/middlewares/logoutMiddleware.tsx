/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { LOGOUT_SUCCESS, SESSION_EXPIRED } from '@streakoid/streakoid-shared/lib/actions/types';
import NavigationService from '../screens/NavigationService';
import { Screens } from '../screens/Screens';
import { AsyncStorage } from 'react-native';

const logoutMiddleware = (store: any) => (next: any) => async (action: AppActions) => {
    if (action.type === LOGOUT_SUCCESS) {
        AsyncStorage.clear();
        NavigationService.navigate(Screens.Login);
    }

    if (action.type === SESSION_EXPIRED) {
        AsyncStorage.clear();
        NavigationService.navigate(Screens.Login);
        NavigationService.navigate('LoginStack');
    }

    const result = next(action);
    return result;
};

export { logoutMiddleware };
