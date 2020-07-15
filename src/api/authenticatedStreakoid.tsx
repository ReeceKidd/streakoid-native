/* eslint-disable @typescript-eslint/no-explicit-any */
import { streakoidAxiosClientFactory, streakoidAxiosSDKFactory } from '@streakoid/streakoid-sdk';
import SupportedRequestHeaders from '@streakoid/streakoid-models/lib/Types/SupportedRequestHeaders';

import { store } from '../../store';
import { londonTimezone } from '@streakoid/streakoid-sdk/lib/streakoid';
import { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

import { SESSION_EXPIRED } from '@streakoid/streakoid-shared/lib/actions/types';
import * as RNLocalize from 'react-native-localize';
import { awsCognitoAuth } from '../awsCongitoAuth';

export const apiUrl = 'https://qz6l18dx09.execute-api.eu-west-1.amazonaws.com/dev';

export const streakoidAuthenticatedClient = streakoidAxiosClientFactory(apiUrl, londonTimezone);

export const getIdToken = async () => {
    try {
        const session = await awsCognitoAuth.currentSession();
        return session.getIdToken().getJwtToken();
    } catch (err) {
        return null;
    }
};

streakoidAuthenticatedClient.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
        const idToken = await getIdToken();
        const userTimezone =
            (store.getState() as any).users &&
            (store.getState() as any).users.currentUser &&
            (store.getState() as any).users.currentUser.timezone;
        const timezone = RNLocalize.getTimeZone();
        if (config.baseURL === apiUrl) {
            config.headers.Authorization = idToken;
            config.headers[SupportedRequestHeaders.Timezone] = userTimezone || timezone || 'Europe/London';
        }

        return config;
    },
    (error: Error) => Promise.reject(error),
);

streakoidAuthenticatedClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        // eslint-disable-next-line no-undef
        console.log(error.response);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (error.response && error.response.status === 401) {
            return store.dispatch({ type: SESSION_EXPIRED });
        }
        return Promise.reject(error);
    },
);

const authenticatedStreakoid = streakoidAxiosSDKFactory(streakoidAuthenticatedClient);

export { authenticatedStreakoid };
