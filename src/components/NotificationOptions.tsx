import React, { Component } from 'react';
import { ListItem, Text } from 'react-native-elements';
import { View, Picker, StyleSheet } from 'react-native';

import { userActions } from '../actions/sharedActions';
import { Spacer } from './Spacer';
import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';
import StreakReminderTypes from '@streakoid/streakoid-models/lib/Types/StreakReminderTypes';
import { CompleteAllStreaksReminderPushNotification } from '@streakoid/streakoid-models/lib/Models/PushNotifications';
import PushNotificationTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationTypes';
import NativePushNotification from 'react-native-push-notification';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell } from '@fortawesome/pro-solid-svg-icons';

interface NotificationOptionsProps {
    updateCurrentUserPushNotifications: typeof userActions.updateCurrentUserPushNotifications;
    currentUser: PopulatedCurrentUser;
    updatePushNotificationsIsLoading: boolean;
    updatePushNotificationsErrorMessage: string;
}

const styles = StyleSheet.create({
    itemTitle: {
        fontSize: 15,
    },
});

class NotificationOptions extends Component<NotificationOptionsProps> {
    componentDidMount = async () => {
        const { currentUser } = this.props;
        const { pushNotifications } = currentUser;
        const { completeAllStreaksReminder } = pushNotifications;
        if (!completeAllStreaksReminder) {
            const defaultReminderHour = 21;
            const defaultReminderMinute = 0;
            const newExpoId = await this.scheduleDailyPush({
                title: 'Complete your streaks!',
                body: 'Complete your streaks before Oid finds out',
                reminderHour: defaultReminderHour,
                reminderMinute: defaultReminderMinute,
            });
            await NativePushNotification.cancelLocalNotifications({ id: newExpoId });
            this.props.updateCurrentUserPushNotifications({
                completeAllStreaksReminder: {
                    expoId: String(newExpoId),
                    reminderHour: defaultReminderHour,
                    reminderMinute: defaultReminderMinute,
                    enabled: false,
                    streakReminderType: StreakReminderTypes.completeAllStreaksReminder,
                },
            });
        }
    };
    scheduleDailyPush = async ({
        title,
        body,
        reminderHour,
        reminderMinute,
    }: {
        title: string;
        body: string;
        reminderHour: number;
        reminderMinute: number;
    }) => {
        title + body;
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const date = currentDate.getDate();
        const data: CompleteAllStreaksReminderPushNotification = {
            pushNotificationType: PushNotificationTypes.completeAllStreaksReminder,
        };
        let scheduleTime = new Date(year, month, date, reminderHour, reminderMinute);

        if (scheduleTime <= new Date()) {
            scheduleTime = new Date(scheduleTime.setDate(scheduleTime.getDate() + 1));
        }
        return NativePushNotification.localNotificationSchedule({
            title,
            message: body,
            userInfo: data,
            date: scheduleTime,
            repeatType: 'day',
        });
    };

    updateCompleteAllStreaksReminderPush = async ({
        reminderHour,
        reminderMinute,
        enabled,
        expoId,
    }: {
        reminderHour: number;
        reminderMinute: number;
        enabled: boolean;
        expoId: string;
    }) => {
        await NativePushNotification.cancelLocalNotifications({ id: expoId });
        if (enabled) {
            const newCompleteAllStreaksPushNotification = await this.scheduleDailyPush({
                title: 'Complete your streaks!',
                body: 'Complete your streaks before Oid finds out',
                reminderHour,
                reminderMinute,
            });
            this.props.updateCurrentUserPushNotifications({
                completeAllStreaksReminder: {
                    expoId: String(newCompleteAllStreaksPushNotification),
                    reminderHour,
                    reminderMinute,
                    enabled,
                    streakReminderType: StreakReminderTypes.completeAllStreaksReminder,
                },
            });
        } else {
            const newCompleteAllStreaksPushNotification = await this.scheduleDailyPush({
                title: 'Complete your streaks!',
                body: 'Complete your streaks before Oid finds out',
                reminderHour,
                reminderMinute,
            });
            await NativePushNotification.cancelLocalNotifications({ id: newCompleteAllStreaksPushNotification });
            this.props.updateCurrentUserPushNotifications({
                completeAllStreaksReminder: {
                    expoId: String(newCompleteAllStreaksPushNotification),
                    reminderHour,
                    reminderMinute,
                    enabled,
                    streakReminderType: StreakReminderTypes.completeAllStreaksReminder,
                },
            });
        }
    };
    renderCompleteStreaksReminderNotification(): JSX.Element | null {
        const { updatePushNotificationsIsLoading } = this.props;
        const title = 'Complete streaks reminder';
        const completeAllStreaksReminder = this.props.currentUser.pushNotifications.completeAllStreaksReminder;
        if (!completeAllStreaksReminder) {
            return null;
        }
        return (
            <ListItem
                disabled={updatePushNotificationsIsLoading}
                title={title}
                titleStyle={styles.itemTitle}
                rightIcon={
                    <FontAwesomeIcon icon={faBell} color={completeAllStreaksReminder.enabled ? 'blue' : 'gray'} />
                }
                onPress={() => {
                    this.updateCompleteAllStreaksReminderPush({
                        ...completeAllStreaksReminder,
                        enabled: !completeAllStreaksReminder.enabled,
                    });
                }}
            />
        );
    }

    renderHourPicker() {
        const hourTimes = [];
        const hoursInDay = 24;
        for (let hour = 0; hour < hoursInDay; hour++) {
            hourTimes.push({ label: `${hour}`, value: hour });
        }
        const { updatePushNotificationsIsLoading } = this.props;
        const completeAllStreaksReminder = this.props.currentUser.pushNotifications.completeAllStreaksReminder;
        if (!completeAllStreaksReminder) {
            return null;
        }
        return (
            <Picker
                enabled={!updatePushNotificationsIsLoading}
                selectedValue={completeAllStreaksReminder.reminderHour}
                onValueChange={(value) => {
                    this.updateCompleteAllStreaksReminderPush({
                        ...completeAllStreaksReminder,
                        reminderHour: value,
                    });
                }}
            >
                {hourTimes.map((hour) => (
                    <Picker.Item key={hour.value} label={hour.label} value={hour.value}></Picker.Item>
                ))}
            </Picker>
        );
    }

    renderMinutePicker() {
        const minuteTimes = [];
        const minutesInHour = 60;
        for (let minute = 0; minute < minutesInHour; minute++) {
            if (minute < 10) {
                minuteTimes.push({ label: `0${minute}`, value: minute });
            } else {
                minuteTimes.push({ label: `${minute}`, value: minute });
            }
        }
        const { updatePushNotificationsIsLoading } = this.props;
        const completeAllStreaksReminder = this.props.currentUser.pushNotifications.completeAllStreaksReminder;
        if (!completeAllStreaksReminder) {
            return null;
        }
        return (
            <Picker
                enabled={!updatePushNotificationsIsLoading}
                selectedValue={completeAllStreaksReminder.reminderMinute}
                onValueChange={(value) => {
                    this.updateCompleteAllStreaksReminderPush({
                        ...completeAllStreaksReminder,
                        reminderMinute: value,
                    });
                }}
            >
                {minuteTimes.map((minute) => (
                    <Picker.Item key={minute.value} label={minute.label} value={minute.value}></Picker.Item>
                ))}
            </Picker>
        );
    }

    renderReminderTime() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 4, flexDirection: 'row', marginLeft: 15, marginTop: 15 }}>
                    <Text style={styles.itemTitle}>Reminder time</Text>
                </View>
                <View style={{ flex: 3 }}>{this.renderHourPicker()}</View>
                <View style={{ flex: 3 }}>{this.renderMinutePicker()}</View>
            </View>
        );
    }

    renderTeamStreakUpdatesNotification(): JSX.Element {
        const { currentUser, updateCurrentUserPushNotifications, updatePushNotificationsIsLoading } = this.props;
        const enabled = currentUser.pushNotifications.teamStreakUpdates.enabled;
        const teamStreakUpdateNotificationListItem = (
            <ListItem
                disabled={updatePushNotificationsIsLoading}
                title={'Team streak updates'}
                titleStyle={styles.itemTitle}
                rightIcon={<FontAwesomeIcon icon={faBell} color={enabled ? 'blue' : 'gray'} />}
                topDivider
                bottomDivider
                onPress={() => {
                    updateCurrentUserPushNotifications({
                        ...currentUser.pushNotifications,
                        teamStreakUpdates: {
                            enabled: !enabled,
                        },
                    });
                }}
            />
        );
        return teamStreakUpdateNotificationListItem;
    }

    renderNewFollowerUpdatesNotification(): JSX.Element {
        const { currentUser, updateCurrentUserPushNotifications, updatePushNotificationsIsLoading } = this.props;
        const enabled = currentUser.pushNotifications.newFollowerUpdates.enabled;
        const newFollowerUpdatesNotificationListItem = (
            <ListItem
                disabled={updatePushNotificationsIsLoading}
                title={'New follower updates'}
                titleStyle={styles.itemTitle}
                rightIcon={<FontAwesomeIcon icon={faBell} color={enabled ? 'blue' : 'gray'} />}
                topDivider
                bottomDivider
                onPress={() => {
                    updateCurrentUserPushNotifications({
                        ...currentUser.pushNotifications,
                        newFollowerUpdates: {
                            enabled: !enabled,
                        },
                    });
                }}
            />
        );

        return newFollowerUpdatesNotificationListItem;
    }

    renderAchievementUpdatesNotification(): JSX.Element {
        const { currentUser, updateCurrentUserPushNotifications, updatePushNotificationsIsLoading } = this.props;
        const enabled = currentUser.pushNotifications.achievementUpdates.enabled;
        return (
            <ListItem
                disabled={updatePushNotificationsIsLoading}
                title={'Achievement updates'}
                titleStyle={styles.itemTitle}
                rightIcon={<FontAwesomeIcon icon={faBell} color={enabled ? 'blue' : 'gray'} />}
                topDivider
                bottomDivider
                onPress={() => {
                    updateCurrentUserPushNotifications({
                        ...currentUser.pushNotifications,
                        achievementUpdates: {
                            enabled: !enabled,
                        },
                    });
                }}
            />
        );
    }

    render(): JSX.Element {
        const completeAllStreaksReminder = this.props.currentUser.pushNotifications.completeAllStreaksReminder;
        const { updatePushNotificationsErrorMessage } = this.props;
        return (
            <View>
                {this.renderCompleteStreaksReminderNotification()}
                {completeAllStreaksReminder?.enabled ? this.renderReminderTime() : null}
                {this.renderTeamStreakUpdatesNotification()}
                {this.renderNewFollowerUpdatesNotification()}
                {this.renderAchievementUpdatesNotification()}
                <Spacer>
                    <Text style={{ color: 'red' }}>{updatePushNotificationsErrorMessage}</Text>
                </Spacer>
            </View>
        );
    }
}

export { NotificationOptions };
