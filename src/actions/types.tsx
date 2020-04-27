import { AppActions } from '@streakoid/streakoid-shared';

export const REGISTER_FOR_PUSH_NOTIFICATION_FAIL = 'REGISTER_FOR_PUSH_NOTIFICATION_FAIL';

export interface RegisterForPushNotificationFailAction {
    type: typeof REGISTER_FOR_PUSH_NOTIFICATION_FAIL;
    payload: string;
}

export type PushNotificationActionTypes = RegisterForPushNotificationFailAction;

export type MobileAppActions = AppActions | PushNotificationActionTypes;
