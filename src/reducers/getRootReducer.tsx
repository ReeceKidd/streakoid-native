import { sharedReducers } from '@streakoid/streakoid-shared';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    ...sharedReducers,
});

export { rootReducer };
