import React, { Component } from 'react';
import { ListItem, Text } from 'react-native-elements';
import { View, Picker, StyleSheet, Platform } from 'react-native';

import { requestNotifications } from 'react-native-permissions';
import { userActions } from '../actions/sharedActions';
import { Spacer } from './Spacer';
import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';
import StreakReminderTypes from '@streakoid/streakoid-sdk/lib/StreakReminderTypes';

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
        const hasPermission = await this.askPermissionForNotifications();
        if (hasPermission && !completeAllStreaksReminder) {
            const defaultReminderHour = 21;
            const defaultReminderMinute = 0;
            const newExpoId = await this.scheduleDailyPush({
                title: 'Complete your streaks!',
                body: 'Complete your streaks before Oid finds out',
                reminderHour: defaultReminderHour,
                reminderMinute: defaultReminderMinute,
            });
            //await Notifications.cancelScheduledNotificationAsync(newExpoId);
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
        // const data: CompleteAllStreaksReminderPushNotification = {
        //     pushNotificationType: PushNotificationTypes.completeAllStreaksReminder,
        // };
        // const dailyPushNotification = {
        //     title,
        //     body,
        //     ios: {
        //         sound: true,
        //     },
        //     data,
        // };
        let scheduleTime = new Date(year, month, date, reminderHour, reminderMinute);

        if (scheduleTime <= new Date()) {
            scheduleTime = new Date(scheduleTime.setDate(scheduleTime.getDate() + 1));
        }
        // const repeat = 'day';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // const schedulingOptions = { time: scheduleTime, repeat } as any;
        //return Notifications.scheduleLocalNotificationAsync(dailyPushNotification, schedulingOptions);
    };

    askPermissionForNotifications = async () => {
        if (Platform.OS === 'ios') {
            const { status } = await requestNotifications(['alert', 'sound']);
            if (status !== 'granted') {
                return false;
            }
            return true;
        }
        return true;
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
        const hasPermission = await this.askPermissionForNotifications();
        if (hasPermission) {
            if (!expoId) {
                return;
            }
            //await Notifications.cancelScheduledNotificationAsync(expoId);
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
                this.props.updateCurrentUserPushNotifications({
                    completeAllStreaksReminder: {
                        reminderHour,
                        reminderMinute,
                        enabled,
                        expoId,
                        streakReminderType: StreakReminderTypes.completeAllStreaksReminder,
                    },
                });
            }
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
                rightIcon={{
                    name: 'phone-android',
                    color: completeAllStreaksReminder.enabled ? 'blue' : 'gray',
                }}
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
                rightIcon={{ name: 'phone-android', color: enabled ? 'blue' : 'gray' }}
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
                rightIcon={{ name: 'phone-android', color: enabled ? 'blue' : 'gray' }}
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
                rightIcon={{ name: 'phone-android', color: enabled ? 'blue' : 'gray' }}
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
