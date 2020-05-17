import React from 'react';

import { Text, Button, Icon } from 'react-native-elements';
import { StyleSheet, View, Picker } from 'react-native';
import NavigationService from '../NavigationService';
import { Screens } from '../Screens';
import { AppState, AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { userActions } from '../../actions/sharedActions';
import { Spacer } from '../../components/Spacer';
import NativePushNotification from 'react-native-push-notification';
import StreakReminderTypes from '@streakoid/streakoid-models/lib/Types/StreakReminderTypes';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    return {
        currentUser,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    updateCurrentUserPushNotifications: bindActionCreators(userActions.updateCurrentUserPushNotifications, dispatch),
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
    link: {
        color: 'blue',
    },
    itemTitle: {
        fontSize: 15,
    },
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class DailyRemindersScreenComponent extends React.PureComponent<Props> {
    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        this.initializeCompleteAllStreaksReminder();
    }

    initializeCompleteAllStreaksReminder = async () => {
        const { currentUser } = this.props;
        const completeAllStreaksReminder = currentUser.pushNotifications.completeAllStreaksReminder;
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const date = currentDate.getDate();
        const defaultReminderHour = 0;
        const reminderHour =
            (completeAllStreaksReminder && completeAllStreaksReminder.reminderHour) || defaultReminderHour;
        const defaultReminderMinute = 0;
        const reminderMinute =
            (completeAllStreaksReminder && completeAllStreaksReminder.reminderMinute) || defaultReminderMinute;
        let scheduleTime = new Date(year, month, date, reminderHour, reminderMinute);

        if (scheduleTime <= new Date()) {
            scheduleTime = new Date(scheduleTime.setDate(scheduleTime.getDate() + 1));
        }

        const pushNotificationId = NativePushNotification.localNotificationSchedule({
            title: 'Complete your streaks',
            message: 'Do it before Oid finds out',
            date: scheduleTime,
            repeatType: 'day',
        });

        this.props.updateCurrentUserPushNotifications({
            completeAllStreaksReminder: {
                expoId: String(pushNotificationId),
                enabled: true,
                reminderHour: 21,
                reminderMinute: 0,
                streakReminderType: StreakReminderTypes.completeAllStreaksReminder,
            },
        });
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
        let scheduleTime = new Date(year, month, date, reminderHour, reminderMinute);

        if (scheduleTime <= new Date()) {
            scheduleTime = new Date(scheduleTime.setDate(scheduleTime.getDate() + 1));
        }
        return NativePushNotification.localNotificationSchedule({
            title,
            message: body,
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
        reminderHour;
        reminderMinute;
        enabled;
        expoId;

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
    };

    renderCompleteStreaksReminderNotification(): JSX.Element | null {
        const completeAllStreaksReminder = this.props.currentUser.pushNotifications.completeAllStreaksReminder;
        if (!completeAllStreaksReminder) {
            return null;
        }
        return (
            <Icon
                name={'phone-android'}
                color={completeAllStreaksReminder.enabled ? 'blue' : 'gray'}
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
        const { updatePushNotificationsIsLoading } = this.props.currentUser;
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
        const { updatePushNotificationsIsLoading } = this.props.currentUser;
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
                <View style={{ flex: 1, flexDirection: 'row', marginLeft: 15, marginTop: 15 }} />
                <View style={{ flex: 4 }}>{this.renderHourPicker()}</View>
                <View style={{ flex: 4 }}>{this.renderMinutePicker()}</View>
                <View style={{ flex: 1, flexDirection: 'row', marginLeft: 15, marginTop: 15 }} />
            </View>
        );
    }

    render(): JSX.Element {
        return (
            <View style={styles.container}>
                <Spacer />
                <Spacer>
                    <Text h4>Do you want a daily reminder to complete your streaks?</Text>
                </Spacer>
                <Spacer>{this.renderCompleteStreaksReminderNotification()}</Spacer>
                <Spacer>
                    <Text>{`Pick a time where Oid will remind you to complete your streaks`}</Text>
                </Spacer>
                <Spacer>{this.renderReminderTime()}</Spacer>

                <Spacer>
                    <Button title="Next" onPress={() => NavigationService.navigate(Screens.CreateFirstStreak)} />
                </Spacer>
            </View>
        );
    }
}

const DailyRemindersScreen = connect(mapStateToProps, mapDispatchToProps)(DailyRemindersScreenComponent);

export { DailyRemindersScreen };
