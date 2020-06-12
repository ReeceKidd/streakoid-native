/* eslint-disable @typescript-eslint/no-explicit-any */
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

const awsCognitoAuth = Auth;
export { awsCognitoAuth };
