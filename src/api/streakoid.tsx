/* eslint-disable @typescript-eslint/no-explicit-any */
import { streakoidClientFactory, streakoidFactory } from '@streakoid/streakoid-sdk';
import SupportedRequestHeaders from '@streakoid/streakoid-models/lib/Types/SupportedRequestHeaders';

import { store } from '../../store';
import { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { SESSION_EXPIRED } from '@streakoid/streakoid-shared/lib/actions/types';

export const apiUrl = 'https://qz6l18dx09.execute-api.eu-west-1.amazonaws.com/dev';
//export const apiUrl = 'http://6196343e.ngrok.io ';

const streakodClient = streakoidClientFactory(apiUrl, 'Europe/London');

import Amplify, { Auth } from 'aws-amplify';
import { AsyncStorage } from 'react-native';

const MEMORY_KEY_PREFIX = '@MemoryStorage:';
let dataMemory: any = {};

class AmplifyAuthStorage {
    static syncPromise: Promise<any>;

    static setItem(key: string, value: string) {
        AsyncStorage.setItem(MEMORY_KEY_PREFIX + key, value);
        dataMemory[key] = value;
        return dataMemory[key];
    }

    static getItem(key: string) {
        return Object.prototype.hasOwnProperty.call(dataMemory, key) ? dataMemory[key] : undefined;
    }

    static removeItem(key: string) {
        AsyncStorage.removeItem(MEMORY_KEY_PREFIX + key);
        return delete dataMemory[key];
    }

    static clear() {
        dataMemory = {};
        return dataMemory;
    }

    static sync() {
        if (!this.syncPromise) {
            this.syncPromise = new Promise((res, rej) => {
                AsyncStorage.getAllKeys((errKeys, keys: any) => {
                    if (errKeys) {
                        rej(errKeys);
                    }
                    const memoryKeys = keys.filter((key: any) => key.startsWith(MEMORY_KEY_PREFIX));
                    AsyncStorage.multiGet(memoryKeys, (err, stores: any) => {
                        if (err) {
                            rej(err);
                        }
                        stores.map((result: any, index: any, store: any) => {
                            const key = store[index][0];
                            const value = store[index][1];
                            const memoryKey = key.replace(MEMORY_KEY_PREFIX, '');
                            dataMemory[memoryKey] = value;
                        });
                        res();
                    });
                });
            });
        }
        return this.syncPromise;
    }
}

Amplify.configure({
    Auth: {
        region: 'eu-west-1',
        userPoolId: 'eu-west-1_jzNG2ske9',
        userPoolWebClientId: '68agp8bcm9bidhh4p97rj1ke1g',
        storage: AmplifyAuthStorage,
    },
});

export const getIdToken = async () => {
    try {
        const session = await Auth.currentSession();
        return session.getIdToken().getJwtToken();
    } catch (err) {
        return null;
    }
};

streakodClient.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
        const idToken = await getIdToken();
        // eslint-disable-next-line no-undef
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (config.baseURL === apiUrl) {
            config.headers.Authorization = idToken;
            config.headers[SupportedRequestHeaders.Timezone] = timezone || 'Europe/London';
        }

        return config;
    },
    (error: Error) => Promise.reject(error),
);

streakodClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        // eslint-disable-next-line no-undef
        console.log(error.response?.data);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (error.response && error.response.status === 401) {
            return store.dispatch({ type: SESSION_EXPIRED });
        }
        return Promise.reject(error);
    },
);

const streakoid = streakoidFactory(streakodClient);

export default streakoid;
