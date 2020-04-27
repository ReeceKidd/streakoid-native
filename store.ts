import { createStore, applyMiddleware } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { AppActions } from '@streakoid/streakoid-shared/lib';

import { navigationMiddleware } from './src/middlewares/navigationMiddleware';
import { logoutMiddleware } from './src/middlewares/logoutMiddleware';
import { rootReducer } from './src/reducers/getRootReducer';
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

export const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    stateReconciler: autoMergeLevel2,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const persistedReducer = persistReducer(persistConfig, rootReducer as any);

export const store = createStore(
    persistedReducer,
    applyMiddleware(navigationMiddleware, logoutMiddleware, thunk as ThunkMiddleware<AppState, AppActions>),
);

export const persistor = persistStore(store);

export type AppState = ReturnType<typeof rootReducer>;
