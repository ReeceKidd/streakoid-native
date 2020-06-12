/* eslint-disable @typescript-eslint/no-explicit-any */
import { streakoidAxiosClientFactory, streakoidAxiosSDKFactory } from '@streakoid/streakoid-sdk';
import { store } from '../../store';
import * as RNLocalize from 'react-native-localize';
import { londonTimezone } from '@streakoid/streakoid-sdk/lib/streakoid';
import { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { getIdToken } from '@streakoid/streakoid-shared/lib';
import SupportedRequestHeaders from '@streakoid/streakoid-models/lib/Types/SupportedRequestHeaders';

const apiUrl = 'https://a8lcon57dg.execute-api.eu-west-1.amazonaws.com/prod/';

export const streakoidAuthenticatedClient = streakoidAxiosClientFactory(apiUrl, londonTimezone);

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
        return Promise.reject(error);
    },
);

const unauthenticatedStreakoid = streakoidAxiosSDKFactory(streakoidAuthenticatedClient);

export { unauthenticatedStreakoid };
