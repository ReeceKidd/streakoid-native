import React, { Component } from 'react';

import { connect } from 'react-redux';
import { AppState } from '../../store';

import { AppActions, getStreakCompletionString } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import NativePushNotification from 'react-native-push-notification';

import { challengeStreakActions, userActions } from '../actions/sharedActions';
import { View, StyleSheet, ActivityIndicator, Picker, Share } from 'react-native';
import { Text, Button, ListItem } from 'react-native-elements';
import { Spacer } from '../components/Spacer';
import { NavigationScreenProp, NavigationState, NavigationEvents } from 'react-navigation';
import { ErrorMessage } from '../components/ErrorMessage';
import { LongestStreakCard } from '../components/LongestStreakCard';
import { StreakStartDateCard } from '../components/StreakStartDateCard';
import { DaysSinceStreakCreationCard } from '../components/DaysSinceStreakCreationCard';
import { TotalNumberOfDaysCard } from '../components/TotalNumberOfDaysCard';
import { StreakRestartsCard } from '../components/StreakRestartsCard';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Screens } from './Screens';
import NavigationService from './NavigationService';
import { IndividualNotes } from '../components/IndividualNotes';
import { GeneralActivityFeed } from '../components/GeneralActivityFeed';
import {
    CustomChallengeStreakReminder,
    CustomStreakReminder,
} from '@streakoid/streakoid-sdk/lib/models/StreakReminders';
import { CustomChallengeStreakReminderPushNotification } from '@streakoid/streakoid-sdk/lib/models/PushNotifications';
import { streakoidUrl } from '../streakoidUrl';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShareAlt, faBell } from '@fortawesome/pro-solid-svg-icons';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import PushNotificationTypes from '@streakoid/streakoid-sdk/lib/PushNotificationTypes';
import StreakReminderTypes from '@streakoid/streakoid-sdk/lib/StreakReminderTypes';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    const selectedChallengeStreak = state && state.challengeStreaks && state.challengeStreaks.selectedChallengeStreak;
    const getChallengeStreakIsLoading =
        state && state.challengeStreaks && state.challengeStreaks.getSelectedChallengeStreakIsLoading;
    const archiveChallengeStreakIsLoading =
        state && state.challengeStreaks && state.challengeStreaks.archiveChallengeStreakIsLoading;
    const archiveChallengeStreakErrorMessage =
        state && state.challengeStreaks && state.challengeStreaks.archiveChallengeStreakErrorMessage;
    const restoreArchivedChallengeStreakIsLoading =
        state && state.challengeStreaks && state.challengeStreaks.restoreArchivedChallengeStreakIsLoading;
    const deleteArchivedChallengeStreakIsLoading =
        state && state.challengeStreaks && state.challengeStreaks.deleteArchivedChallengeStreakIsLoading;
    const restoreArchivedChallengeStreakErrorMessage =
        state && state.challengeStreaks && state.challengeStreaks.restoreArchivedChallengeStreakErrorMessage;
    const deleteArchivedChallengeStreakErrorMessage =
        state && state.challengeStreaks && state.challengeStreaks.deleteArchivedChallengeStreakErrorMessage;
    return {
        currentUser,
        selectedChallengeStreak,
        getChallengeStreakIsLoading,
        archiveChallengeStreakIsLoading,
        archiveChallengeStreakErrorMessage,
        restoreArchivedChallengeStreakIsLoading,
        deleteArchivedChallengeStreakIsLoading,
        restoreArchivedChallengeStreakErrorMessage,
        deleteArchivedChallengeStreakErrorMessage,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getChallengeStreak: bindActionCreators(challengeStreakActions.getChallengeStreak, dispatch),
    archiveChallengeStreak: bindActionCreators(challengeStreakActions.archiveChallengeStreak, dispatch),
    clearArchiveChallengeStreakErrorMessage: bindActionCreators(
        challengeStreakActions.clearArchiveChallengeStreakErrorMessage,
        dispatch,
    ),
    restoreArchivedChallengeStreak: bindActionCreators(challengeStreakActions.restoreArchivedChallengeStreak, dispatch),
    completeSelectedChallengeStreak: bindActionCreators(
        challengeStreakActions.completeSelectedChallengeStreakTask,
        dispatch,
    ),
    incompleteSelectedChallengeStreak: bindActionCreators(
        challengeStreakActions.incompleteSelectedChallengeStreakTask,
        dispatch,
    ),
    clearRestoreArchivedChallengeStreakErrorMessage: bindActionCreators(
        challengeStreakActions.clearRestoreArchivedChallengeStreakErrorMessage,
        dispatch,
    ),
    deleteArchivedChallengeStreak: bindActionCreators(challengeStreakActions.deleteArchivedChallengeStreak, dispatch),
    updateCurrentUserPushNotification: bindActionCreators(userActions.updateCurrentUserPushNotifications, dispatch),
    updateCustomChallengeStreakReminder: bindActionCreators(
        challengeStreakActions.updateCustomChallengeStreakReminderPushNotification,
        dispatch,
    ),
});

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, { _id: string; streakName: string }>;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
    itemTitle: {
        fontSize: 15,
    },
});

class ChallengeStreakInfoComponent extends Component<Props> {
    static navigationOptions = ({
        navigation,
    }: {
        navigation: NavigationScreenProp<NavigationState, { _id: string; streakName: string }>;
    }) => {
        const streakId = navigation.getParam('_id');
        const streakName = navigation.getParam('streakName');
        return {
            title: streakName,
            headerRight: (
                <Button
                    type="clear"
                    icon={<FontAwesomeIcon icon={faShareAlt} />}
                    onPress={async () => {
                        await Share.share({
                            message: `View challenge streak ${streakName} at ${streakoidUrl}/${RouterCategories.challengeStreaks}/${streakId}`,
                            url: `${streakoidUrl}/${RouterCategories.challengeStreaks}/${streakId}`,
                            title: `View Streakoid challenge streak ${streakName}`,
                        });
                    }}
                />
            ),
        };
    };

    componentDidMount() {
        this.props.getChallengeStreak({ challengeStreakId: this.props.navigation.getParam('_id') });
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.navigation.getParam('_id') !== this.props.navigation.getParam('_id')) {
            this.props.getChallengeStreak({ challengeStreakId: this.props.navigation.getParam('_id') });
        }
    }

    scheduleDailyPush = async ({
        title,
        body,
        reminderHour,
        reminderMinute,
        challengeStreakId,
        challengeName,
    }: {
        title: string;
        body: string;
        reminderHour: number;
        reminderMinute: number;
        challengeStreakId: string;
        challengeName: string;
    }) => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const date = currentDate.getDate();
        const data: CustomChallengeStreakReminderPushNotification = {
            pushNotificationType: PushNotificationTypes.customChallengeStreakReminder,
            challengeStreakId,
            challengeName,
        };
        const dailyPushNotification = {
            title,
            body,
            ios: {
                sound: true,
            },
            data,
        };
        dailyPushNotification;
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

    updateCustomChallengeStreakReminder = async ({
        reminderHour,
        reminderMinute,
        enabled,
        challengeId,
    }: {
        reminderHour: number;
        reminderMinute: number;
        enabled: boolean;
        challengeId: string;
    }) => {
        const challengeName = this.props.navigation.getParam('streakName');
        const challengeStreakId = this.props.navigation.getParam('_id');
        const customStreakReminders = this.props.currentUser.pushNotifications.customStreakReminders;
        const customCompleteChallengeStreakReminder = customStreakReminders.find(
            (pushNotification) =>
                pushNotification.streakReminderType === StreakReminderTypes.customChallengeStreakReminder &&
                pushNotification.challengeStreakId == challengeStreakId,
        );
        if (customCompleteChallengeStreakReminder) {
            await NativePushNotification.cancelLocalNotifications({ id: customCompleteChallengeStreakReminder.expoId });
        }
        if (enabled) {
            const newExpoId = await this.scheduleDailyPush({
                title: `Complete your challenge streak!`,
                body: `Complete ${challengeName}.`,
                reminderHour,
                reminderMinute,
                challengeStreakId,
                challengeName,
            });

            const newCustomChallengeStreakReminder: CustomChallengeStreakReminder = {
                expoId: String(newExpoId),
                reminderHour,
                reminderMinute,
                enabled,
                streakReminderType: StreakReminderTypes.customChallengeStreakReminder,
                challengeStreakId,
                challengeName,
                challengeId,
            };
            const customStreakRemindersWithoutOldReminder = customStreakReminders.filter(
                (pushNotification) =>
                    !(
                        pushNotification.streakReminderType === StreakReminderTypes.customChallengeStreakReminder &&
                        pushNotification.challengeStreakId === challengeStreakId
                    ),
            );

            const newCustomStreakReminders: CustomStreakReminder[] = [
                ...customStreakRemindersWithoutOldReminder,
                newCustomChallengeStreakReminder,
            ];
            this.props.updateCustomChallengeStreakReminder({
                customChallengeStreakReminder: newCustomChallengeStreakReminder,
            });
            this.props.updateCurrentUserPushNotification({
                customStreakReminders: newCustomStreakReminders,
            });
        } else {
            if (customCompleteChallengeStreakReminder) {
                const customStreakRemindersWithoutOldReminder = customStreakReminders.filter(
                    (pushNotification) =>
                        !(
                            pushNotification.streakReminderType === StreakReminderTypes.customChallengeStreakReminder &&
                            pushNotification.challengeStreakId === challengeStreakId
                        ),
                );
                const updatedCustomStreakReminder: CustomChallengeStreakReminder = {
                    ...customCompleteChallengeStreakReminder,
                    streakReminderType: StreakReminderTypes.customChallengeStreakReminder,
                    challengeStreakId,
                    challengeName,
                    challengeId,
                    reminderHour,
                    reminderMinute,
                    enabled,
                };
                const newCustomStreakReminders: CustomStreakReminder[] = [
                    ...customStreakRemindersWithoutOldReminder,
                    updatedCustomStreakReminder,
                ];
                this.props.updateCustomChallengeStreakReminder({
                    customChallengeStreakReminder: updatedCustomStreakReminder,
                });
                this.props.updateCurrentUserPushNotification({
                    customStreakReminders: newCustomStreakReminders,
                });
            }
        }
    };

    renderCustomStreakReminderOptions() {
        const title = 'Complete challenge streak reminder';
        const customChallengeStreakReminder = this.props.selectedChallengeStreak.customChallengeStreakReminder;
        const enabled = (customChallengeStreakReminder && customChallengeStreakReminder.enabled) || false;
        const reminderHour = (customChallengeStreakReminder && customChallengeStreakReminder.reminderHour) || 21;
        const reminderMinute = (customChallengeStreakReminder && customChallengeStreakReminder.reminderMinute) || 0;
        const { selectedChallengeStreak } = this.props;
        return (
            <ListItem
                title={title}
                titleStyle={styles.itemTitle}
                leftIcon={<FontAwesomeIcon icon={faBell} color={enabled ? 'blue' : 'gray'} />}
                onPress={() => {
                    this.updateCustomChallengeStreakReminder({
                        reminderHour,
                        reminderMinute,
                        enabled: !enabled,
                        challengeId: selectedChallengeStreak.challengeId,
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
        const customChallengeStreakReminder = this.props.selectedChallengeStreak.customChallengeStreakReminder;
        const enabled = (customChallengeStreakReminder && customChallengeStreakReminder.enabled) || false;
        const reminderHour = (customChallengeStreakReminder && customChallengeStreakReminder.reminderHour) || 21;
        const reminderMinute = (customChallengeStreakReminder && customChallengeStreakReminder.reminderMinute) || 0;
        const { selectedChallengeStreak } = this.props;
        return (
            <Picker
                selectedValue={reminderHour}
                onValueChange={(value) => {
                    this.updateCustomChallengeStreakReminder({
                        reminderHour: value,
                        reminderMinute,
                        enabled,
                        challengeId: selectedChallengeStreak._id,
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
        const customChallengeStreakReminder = this.props.selectedChallengeStreak.customChallengeStreakReminder;
        const enabled = (customChallengeStreakReminder && customChallengeStreakReminder.enabled) || false;
        const reminderHour = (customChallengeStreakReminder && customChallengeStreakReminder.reminderHour) || 21;
        const reminderMinute = (customChallengeStreakReminder && customChallengeStreakReminder.reminderMinute) || 0;
        const { selectedChallengeStreak } = this.props;
        return (
            <Picker
                selectedValue={reminderMinute}
                onValueChange={(value) => {
                    this.updateCustomChallengeStreakReminder({
                        reminderHour,
                        reminderMinute: value,
                        enabled,
                        challengeId: selectedChallengeStreak.challengeId,
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
                    <Text style={styles.itemTitle}>Time:</Text>
                </View>
                <View style={{ flex: 3 }}>{this.renderHourPicker()}</View>
                <View style={{ flex: 3 }}>{this.renderMinutePicker()}</View>
            </View>
        );
    }

    clearMessages = (): void => {
        this.props.clearArchiveChallengeStreakErrorMessage();
    };

    archiveChallengeStreak = async ({ selectedChallengeStreakId }: { selectedChallengeStreakId: string }) => {
        const { archiveChallengeStreak } = this.props;
        archiveChallengeStreak({ challengeStreakId: selectedChallengeStreakId });
    };

    render(): JSX.Element {
        const {
            currentUser,
            selectedChallengeStreak,
            getChallengeStreakIsLoading,
            archiveChallengeStreakIsLoading,
            archiveChallengeStreakErrorMessage,
            restoreArchivedChallengeStreak,
            restoreArchivedChallengeStreakErrorMessage,
            restoreArchivedChallengeStreakIsLoading,
            deleteArchivedChallengeStreak,
            deleteArchivedChallengeStreakErrorMessage,
            deleteArchivedChallengeStreakIsLoading,
        } = this.props;
        const streakCompletionString = getStreakCompletionString({
            pastStreaks: selectedChallengeStreak.pastStreaks,
            currentStreak: selectedChallengeStreak.currentStreak,
            timezone: selectedChallengeStreak.timezone,
            createdAt: new Date(selectedChallengeStreak.createdAt),
        });
        return (
            <ScrollView style={styles.container}>
                {getChallengeStreakIsLoading ? (
                    <Spacer>
                        <ActivityIndicator />
                    </Spacer>
                ) : (
                    <View>
                        <NavigationEvents
                            onWillFocus={() => {
                                this.props.getChallengeStreak({
                                    challengeStreakId: this.props.navigation.getParam('_id'),
                                });
                            }}
                        />
                        {selectedChallengeStreak.userId === currentUser._id ? (
                            selectedChallengeStreak.status === StreakStatus.live ? (
                                <Spacer>
                                    {selectedChallengeStreak.completedToday ? (
                                        <Button
                                            title="Incomplete"
                                            buttonStyle={{ backgroundColor: 'red' }}
                                            loading={selectedChallengeStreak.incompleteSelectedChallengeStreakIsLoading}
                                            onPress={() =>
                                                this.props.incompleteSelectedChallengeStreak(
                                                    selectedChallengeStreak._id,
                                                )
                                            }
                                        />
                                    ) : (
                                        <Button
                                            title="Complete"
                                            loading={selectedChallengeStreak.completeSelectedChallengeStreakIsLoading}
                                            onPress={() =>
                                                this.props.completeSelectedChallengeStreak(selectedChallengeStreak._id)
                                            }
                                        />
                                    )}
                                </Spacer>
                            ) : null
                        ) : null}
                        <Spacer>
                            {selectedChallengeStreak.status === StreakStatus.live ? (
                                <Text style={{ color: 'green' }}>Live</Text>
                            ) : (
                                <Text style={{ color: 'red' }}>Archived</Text>
                            )}
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate(Screens.UserProfile, {
                                        username: selectedChallengeStreak.username,
                                        _id: selectedChallengeStreak.userId,
                                    });
                                }}
                            >
                                <ListItem
                                    leftAvatar={{
                                        source: { uri: selectedChallengeStreak.userProfileImage },
                                    }}
                                    title={selectedChallengeStreak.username}
                                />
                            </TouchableOpacity>
                            <Text style={{ color: streakCompletionString.error ? 'red' : 'green' }}>
                                {streakCompletionString.string}
                            </Text>
                            <Spacer />
                            {selectedChallengeStreak && selectedChallengeStreak.challengeName ? (
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate(Screens.ChallengeInfo, {
                                            challengeName: selectedChallengeStreak.challengeName,
                                            _id: selectedChallengeStreak.challengeId,
                                        });
                                    }}
                                >
                                    <Text h4 style={{ color: 'blue' }}>
                                        {selectedChallengeStreak.challengeName}
                                    </Text>
                                </TouchableOpacity>
                            ) : null}
                            <Spacer />
                            {selectedChallengeStreak && selectedChallengeStreak.challengeDescription ? (
                                <Text> {selectedChallengeStreak.challengeDescription}</Text>
                            ) : null}
                        </Spacer>
                        {selectedChallengeStreak.userId === currentUser._id &&
                        selectedChallengeStreak.status === StreakStatus.live ? (
                            <Spacer>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontWeight: 'bold' }}>{`Notifications `}</Text>
                                    {currentUser.updatePushNotificationsIsLoading ? <ActivityIndicator /> : null}
                                </View>
                                {this.renderCustomStreakReminderOptions()}
                                {selectedChallengeStreak.customChallengeStreakReminder?.enabled
                                    ? this.renderReminderTime()
                                    : null}
                            </Spacer>
                        ) : null}
                        <Spacer>
                            {selectedChallengeStreak.userId === currentUser._id ? (
                                <>
                                    <Text style={{ fontWeight: 'bold' }}>Notes</Text>
                                    <Spacer>
                                        <Button
                                            title="Add note"
                                            onPress={() => NavigationService.navigate(Screens.AddNoteToChallengeStreak)}
                                        />
                                    </Spacer>
                                    <IndividualNotes subjectId={this.props.navigation.getParam('_id')} />
                                </>
                            ) : null}
                            <Text style={{ fontWeight: 'bold' }}>Stats</Text>
                            <LongestStreakCard longestStreak={selectedChallengeStreak.longestStreak} />
                            <TotalNumberOfDaysCard totalTimesTracked={selectedChallengeStreak.totalTimesTracked} />
                            <StreakStartDateCard createdAt={new Date(selectedChallengeStreak.createdAt)} />
                            <DaysSinceStreakCreationCard
                                daysSinceStreakCreation={selectedChallengeStreak.daysSinceStreakCreation}
                            />
                            <StreakRestartsCard numberOfRestarts={selectedChallengeStreak.numberOfRestarts} />
                        </Spacer>
                        <Spacer>
                            <Text style={{ fontWeight: 'bold' }}>Activity Feed</Text>
                            <GeneralActivityFeed
                                navigation={this.props.navigation}
                                activityFeedItems={selectedChallengeStreak.activityFeed.activityFeedItems}
                            />
                        </Spacer>
                        {selectedChallengeStreak.userId === currentUser._id ? (
                            selectedChallengeStreak.status === StreakStatus.live ? (
                                <>
                                    <Spacer>
                                        <Button
                                            onPress={() =>
                                                this.archiveChallengeStreak({
                                                    selectedChallengeStreakId: this.props.navigation.getParam('_id'),
                                                })
                                            }
                                            buttonStyle={{ backgroundColor: 'red' }}
                                            loading={archiveChallengeStreakIsLoading}
                                            title="Archive"
                                        />
                                        <ErrorMessage message={archiveChallengeStreakErrorMessage} />
                                    </Spacer>
                                </>
                            ) : (
                                <>
                                    <Spacer>
                                        <Button
                                            onPress={() =>
                                                restoreArchivedChallengeStreak(this.props.navigation.getParam('_id'))
                                            }
                                            buttonStyle={{ backgroundColor: 'green' }}
                                            loading={restoreArchivedChallengeStreakIsLoading}
                                            title="Restore"
                                        />
                                        <ErrorMessage message={restoreArchivedChallengeStreakErrorMessage} />
                                    </Spacer>
                                    <Spacer>
                                        <Button
                                            onPress={() =>
                                                deleteArchivedChallengeStreak(this.props.navigation.getParam('_id'))
                                            }
                                            buttonStyle={{ backgroundColor: 'red' }}
                                            loading={deleteArchivedChallengeStreakIsLoading}
                                            title="Delete"
                                        />
                                        <ErrorMessage message={deleteArchivedChallengeStreakErrorMessage} />
                                    </Spacer>
                                </>
                            )
                        ) : null}
                    </View>
                )}
            </ScrollView>
        );
    }
}

const ChallengeStreakInfoScreen = connect(mapStateToProps, mapDispatchToProps)(ChallengeStreakInfoComponent);

export { ChallengeStreakInfoScreen };
