import React, { PureComponent } from 'react';

import { AppState } from '../../store';

import { AppActions, getStreakCompletionInfo } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { soloStreakActions, userActions } from '../actions/authenticatedSharedActions';
import { Text, Button, ListItem } from 'react-native-elements';
import { Spacer } from '../components/Spacer';
import { LoadingScreenSpinner } from '../components/LoadingScreenSpinner';
import { Screens } from './Screens';
import { ErrorMessage } from '../components/ErrorMessage';
import { connect } from 'react-redux';
import { LongestStreakCard } from '../components/LongestStreakCard';
import { TotalNumberOfDaysCard } from '../components/TotalNumberOfDaysCard';
import { StreakStartDateCard } from '../components/StreakStartDateCard';
import { DaysSinceStreakCreationCard } from '../components/DaysSinceStreakCreationCard';
import { StreakRestartsCard } from '../components/StreakRestartsCard';
import { TouchableOpacity } from 'react-native';
import { IndividualNotes } from '../components/IndividualNotes';
import { Picker, StyleSheet, View, ActivityIndicator } from 'react-native';
import NativePushNotification from 'react-native-push-notification';

import { GeneralActivityFeed } from '../components/GeneralActivityFeed';
import { CustomSoloStreakReminderPushNotification } from '@streakoid/streakoid-models/lib/Models/PushNotifications';
import { CustomSoloStreakReminder, CustomStreakReminder } from '@streakoid/streakoid-models/lib/Models/StreakReminders';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell } from '@fortawesome/pro-solid-svg-icons';
import PushNotificationTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationTypes';
import StreakReminderTypes from '@streakoid/streakoid-models/lib/Types/StreakReminderTypes';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { StreakFlame } from '../components/StreakFlame';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../screenNavigation/RootNavigator';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    const selectedUser = state && state.users && state.users.selectedUser;
    const selectedSoloStreak = state && state.soloStreaks && state.soloStreaks.selectedSoloStreak;
    const getSoloStreakIsLoading = state && state.soloStreaks && state.soloStreaks.getSoloStreakIsLoading;
    const archiveSoloStreakIsLoading = state && state.soloStreaks && state.soloStreaks.archiveSoloStreakIsLoading;
    const archiveSoloStreakErrorMessage = state && state.soloStreaks && state.soloStreaks.archiveSoloStreakErrorMessage;
    const restoreArchivedSoloStreakIsLoading =
        state && state.soloStreaks && state.soloStreaks.restoreArchivedSoloStreakIsLoading;
    const deleteArchivedSoloStreakIsLoading =
        state && state.soloStreaks && state.soloStreaks.deleteArchivedSoloStreakIsLoading;
    const restoreArchivedSoloStreakErrorMessage =
        state && state.soloStreaks && state.soloStreaks.restoreArchivedSoloStreakErrorMessage;
    const deleteArchivedSoloStreakErrorMessage =
        state && state.soloStreaks && state.soloStreaks.deleteArchivedSoloStreakErrorMessage;
    return {
        currentUser,
        selectedUser,
        selectedSoloStreak,
        getSoloStreakIsLoading,
        archiveSoloStreakIsLoading,
        archiveSoloStreakErrorMessage,
        restoreArchivedSoloStreakIsLoading,
        deleteArchivedSoloStreakIsLoading,
        restoreArchivedSoloStreakErrorMessage,
        deleteArchivedSoloStreakErrorMessage,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getSoloStreak: bindActionCreators(soloStreakActions.getSoloStreak, dispatch),
    archiveSoloStreak: bindActionCreators(soloStreakActions.archiveSoloStreak, dispatch),
    clearArchiveSoloStreakErrorMessage: bindActionCreators(
        soloStreakActions.clearArchiveSoloStreakErrorMessage,
        dispatch,
    ),
    restoreArchivedSoloStreak: bindActionCreators(soloStreakActions.restoreArchivedSoloStreak, dispatch),
    completeSelectedSoloStreak: bindActionCreators(soloStreakActions.completeSelectedSoloStreakTask, dispatch),
    incompleteSelectedSoloStreak: bindActionCreators(soloStreakActions.incompleteSelectedSoloStreakTask, dispatch),
    clearRestoreArchivedSoloStreakErrorMessage: bindActionCreators(
        soloStreakActions.clearRestoreArchivedSoloStreakErrorMessage,
        dispatch,
    ),
    deleteArchivedSoloStreak: bindActionCreators(soloStreakActions.deleteArchivedSoloStreak, dispatch),
    clearSelectedSoloStreak: bindActionCreators(soloStreakActions.clearSelectedSoloStreak, dispatch),
    updateCurrentUserPushNotification: bindActionCreators(userActions.updateCurrentUserPushNotifications, dispatch),
    updateCustomSoloStreakReminder: bindActionCreators(soloStreakActions.updateCustomSoloStreakReminder, dispatch),
});

type SoloStreakInfoScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.SoloStreakInfo>;
type SoloStreakInfoScreenRouteProp = RouteProp<RootStackParamList, Screens.SoloStreakInfo>;

type NavigationProps = {
    navigation: SoloStreakInfoScreenNavigationProp;
    route: SoloStreakInfoScreenRouteProp;
};
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    itemTitle: {
        fontSize: 15,
    },
});

class SoloStreakInfoScreenComponent extends PureComponent<Props> {
    componentDidMount() {
        this.props.getSoloStreak(this.props.route.params._id);
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.route.params._id !== this.props.route.params._id) {
            this.props.getSoloStreak(this.props.route.params._id);
        }
    }

    clearMessages = (): void => {
        this.props.clearArchiveSoloStreakErrorMessage();
    };

    scheduleDailyPush = async ({
        title,
        body,
        reminderHour,
        reminderMinute,
        soloStreakId,
        soloStreakName,
    }: {
        title: string;
        body: string;
        reminderHour: number;
        reminderMinute: number;
        soloStreakId: string;
        soloStreakName: string;
    }) => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const date = currentDate.getDate();
        const data: CustomSoloStreakReminderPushNotification = {
            pushNotificationType: PushNotificationTypes.customSoloStreakReminder,
            soloStreakId,
            soloStreakName,
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

    updateCustomSoloStreakReminder = async ({
        reminderHour,
        reminderMinute,
        enabled,
    }: {
        reminderHour: number;
        reminderMinute: number;
        enabled: boolean;
    }) => {
        const soloStreakName = this.props.route.params.streakName;
        const soloStreakId = this.props.route.params._id;
        const customStreakReminders = this.props.currentUser.pushNotifications.customStreakReminders;
        const customCompleteSoloStreakReminder = customStreakReminders.find(
            (pushNotification) =>
                pushNotification.streakReminderType === StreakReminderTypes.customSoloStreakReminder &&
                pushNotification.soloStreakId == soloStreakId,
        );
        if (customCompleteSoloStreakReminder) {
            await NativePushNotification.cancelLocalNotifications({ id: customCompleteSoloStreakReminder.expoId });
        }
        if (enabled) {
            const newExpoId = await this.scheduleDailyPush({
                title: `Complete your solo streak!`,
                body: `Complete ${soloStreakName && soloStreakName.trim()}.`,
                reminderHour,
                reminderMinute,
                soloStreakId,
                soloStreakName,
            });

            const newCustomSoloStreakReminder: CustomSoloStreakReminder = {
                expoId: String(newExpoId),
                reminderHour,
                reminderMinute,
                enabled,
                streakReminderType: StreakReminderTypes.customSoloStreakReminder,
                soloStreakId,
                soloStreakName,
            };
            const customStreakRemindersWithoutOldReminder = customStreakReminders.filter(
                (pushNotification) =>
                    !(
                        pushNotification.streakReminderType === StreakReminderTypes.customSoloStreakReminder &&
                        pushNotification.soloStreakId === soloStreakId
                    ),
            );

            const newCustomStreakReminders: CustomStreakReminder[] = [
                ...customStreakRemindersWithoutOldReminder,
                newCustomSoloStreakReminder,
            ];
            this.props.updateCustomSoloStreakReminder({
                customSoloStreakReminder: newCustomSoloStreakReminder,
            });
            this.props.updateCurrentUserPushNotification({
                customStreakReminders: newCustomStreakReminders,
            });
        } else {
            if (customCompleteSoloStreakReminder) {
                const customStreakRemindersWithoutOldReminder = customStreakReminders.filter(
                    (pushNotification) =>
                        !(
                            pushNotification.streakReminderType === StreakReminderTypes.customSoloStreakReminder &&
                            pushNotification.soloStreakId === soloStreakId
                        ),
                );
                const updatedCustomStreakReminder: CustomSoloStreakReminder = {
                    ...customCompleteSoloStreakReminder,
                    streakReminderType: StreakReminderTypes.customSoloStreakReminder,
                    soloStreakId,
                    soloStreakName,
                    reminderHour,
                    reminderMinute,
                    enabled,
                };
                const newCustomStreakReminders: CustomStreakReminder[] = [
                    ...customStreakRemindersWithoutOldReminder,
                    updatedCustomStreakReminder,
                ];
                this.props.updateCustomSoloStreakReminder({ customSoloStreakReminder: updatedCustomStreakReminder });
                this.props.updateCurrentUserPushNotification({
                    customStreakReminders: newCustomStreakReminders,
                });
            }
        }
    };

    renderCustomStreakReminderOptions() {
        const title = 'Complete solo streak reminder';

        const customSoloStreakReminder = this.props.selectedSoloStreak.customSoloStreakReminder;
        const enabled = (customSoloStreakReminder && customSoloStreakReminder.enabled) || false;
        const reminderHour = (customSoloStreakReminder && customSoloStreakReminder.reminderHour) || 21;
        const reminderMinute = (customSoloStreakReminder && customSoloStreakReminder.reminderMinute) || 0;
        return (
            <ListItem
                title={title}
                titleStyle={styles.itemTitle}
                leftIcon={<FontAwesomeIcon icon={faBell} color={enabled ? 'blue' : 'gray'} />}
                onPress={() => {
                    this.updateCustomSoloStreakReminder({
                        reminderHour,
                        reminderMinute,
                        enabled: !enabled,
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

        const customSoloStreakReminder = this.props.selectedSoloStreak.customSoloStreakReminder;
        const enabled = (customSoloStreakReminder && customSoloStreakReminder.enabled) || false;
        const reminderHour = (customSoloStreakReminder && customSoloStreakReminder.reminderHour) || 21;
        const reminderMinute = (customSoloStreakReminder && customSoloStreakReminder.reminderMinute) || 0;
        return (
            <Picker
                selectedValue={reminderHour}
                onValueChange={(value) => {
                    this.updateCustomSoloStreakReminder({
                        reminderHour: value,
                        reminderMinute,
                        enabled,
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

        const customSoloStreakReminder = this.props.selectedSoloStreak.customSoloStreakReminder;
        const enabled = (customSoloStreakReminder && customSoloStreakReminder.enabled) || false;
        const reminderHour = (customSoloStreakReminder && customSoloStreakReminder.reminderHour) || 21;
        const reminderMinute = (customSoloStreakReminder && customSoloStreakReminder.reminderMinute) || 0;
        return (
            <Picker
                selectedValue={reminderMinute}
                onValueChange={(value) => {
                    this.updateCustomSoloStreakReminder({
                        reminderHour,
                        reminderMinute: value,
                        enabled,
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

    archiveSoloStreak = async ({ selectedSoloStreakId }: { selectedSoloStreakId: string }) => {
        const { archiveSoloStreak } = this.props;
        archiveSoloStreak({ soloStreakId: selectedSoloStreakId });
    };

    render(): JSX.Element | null {
        const {
            currentUser,
            selectedSoloStreak,
            getSoloStreakIsLoading,
            archiveSoloStreakIsLoading,
            archiveSoloStreakErrorMessage,
            restoreArchivedSoloStreak,
            deleteArchivedSoloStreak,
            restoreArchivedSoloStreakIsLoading,
            deleteArchivedSoloStreakIsLoading,
            deleteArchivedSoloStreakErrorMessage,
        } = this.props;
        const { pastStreaks, currentStreak, timezone, createdAt } = selectedSoloStreak;
        const streakCompletionInfo = getStreakCompletionInfo({
            pastStreaks,
            currentStreak,
            timezone,
            createdAt: new Date(createdAt),
        });
        const daysSinceUserCompletedStreak = streakCompletionInfo && streakCompletionInfo.daysSinceUserCompletedStreak;
        const daysSinceUserCreatedStreak = streakCompletionInfo && streakCompletionInfo.daysSinceUserCreatedStreak;
        const negativeDayStreak = daysSinceUserCompletedStreak || daysSinceUserCreatedStreak || 0;
        return (
            <>
                {getSoloStreakIsLoading ? (
                    <LoadingScreenSpinner />
                ) : (
                    <ScrollView>
                        {selectedSoloStreak.userId === currentUser._id ? (
                            selectedSoloStreak.status === StreakStatus.live ? (
                                <Spacer>
                                    {selectedSoloStreak.completedToday ? (
                                        <Button
                                            title="Incomplete"
                                            buttonStyle={{ backgroundColor: 'red' }}
                                            loading={selectedSoloStreak.incompleteSelectedSoloStreakIsLoading}
                                            onPress={() =>
                                                this.props.incompleteSelectedSoloStreak(selectedSoloStreak._id)
                                            }
                                        />
                                    ) : (
                                        <Button
                                            title="Complete"
                                            loading={selectedSoloStreak.completeSelectedSoloStreakIsLoading}
                                            onPress={() =>
                                                this.props.completeSelectedSoloStreak(selectedSoloStreak._id)
                                            }
                                        />
                                    )}
                                </Spacer>
                            ) : null
                        ) : null}
                        <Spacer>
                            {selectedSoloStreak.status === StreakStatus.live ? (
                                <Text style={{ color: 'green' }}>Live</Text>
                            ) : (
                                <Text style={{ color: 'red' }}>Archived</Text>
                            )}
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate(Screens.UserProfile, {
                                        username: selectedSoloStreak.username,
                                        _id: selectedSoloStreak.userId,
                                        profileImage: selectedSoloStreak.userProfileImage,
                                    });
                                }}
                            >
                                <ListItem
                                    leftAvatar={{
                                        source: { uri: selectedSoloStreak.userProfileImage },
                                    }}
                                    title={selectedSoloStreak.username}
                                />
                            </TouchableOpacity>

                            <StreakFlame
                                currentStreakNumberOfDaysInARow={currentStreak.numberOfDaysInARow}
                                negativeDayStreak={negativeDayStreak}
                            />
                            {selectedSoloStreak && selectedSoloStreak.streakDescription ? (
                                <Text>{selectedSoloStreak && selectedSoloStreak.streakDescription}</Text>
                            ) : null}
                        </Spacer>
                        {selectedSoloStreak.userId === currentUser._id &&
                        selectedSoloStreak.status === StreakStatus.live ? (
                            <Spacer>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontWeight: 'bold' }}>{`Notifications `}</Text>
                                    {currentUser.updatePushNotificationsIsLoading ? <ActivityIndicator /> : null}
                                </View>
                                {this.renderCustomStreakReminderOptions()}
                                {selectedSoloStreak.customSoloStreakReminder?.enabled
                                    ? this.renderReminderTime()
                                    : null}
                            </Spacer>
                        ) : null}
                        <Spacer>
                            {selectedSoloStreak.userId === currentUser._id ? (
                                <>
                                    <Text style={{ fontWeight: 'bold' }}>Notes</Text>
                                    <Spacer>
                                        <Button
                                            title="Add note"
                                            onPress={() => this.props.navigation.push(Screens.AddNoteToSoloStreak)}
                                        />
                                    </Spacer>
                                    <IndividualNotes subjectId={this.props.route.params._id} />
                                </>
                            ) : null}
                            <Text style={{ fontWeight: 'bold' }}>Stats</Text>
                            <LongestStreakCard longestStreak={selectedSoloStreak.longestStreak} />
                            <TotalNumberOfDaysCard totalTimesTracked={selectedSoloStreak.totalTimesTracked} />
                            <StreakStartDateCard createdAt={new Date(selectedSoloStreak.createdAt)} />
                            <DaysSinceStreakCreationCard
                                daysSinceStreakCreation={selectedSoloStreak.daysSinceStreakCreation}
                            />
                            <StreakRestartsCard numberOfRestarts={selectedSoloStreak.numberOfRestarts} />
                            <Spacer />
                            <Text style={{ fontWeight: 'bold' }}>Activity Feed</Text>
                            <Spacer />
                            <GeneralActivityFeed
                                activityFeedItems={selectedSoloStreak.activityFeed.activityFeedItems}
                                navigation={this.props.navigation}
                                currentUserId={this.props.currentUser._id}
                            />
                        </Spacer>
                        {selectedSoloStreak.userId === currentUser._id ? (
                            selectedSoloStreak.status === StreakStatus.live ? (
                                <>
                                    <Spacer>
                                        <Button
                                            onPress={() => {
                                                this.archiveSoloStreak({
                                                    selectedSoloStreakId: selectedSoloStreak._id,
                                                });
                                                this.props.navigation.pop();
                                            }}
                                            buttonStyle={{ backgroundColor: 'red' }}
                                            loading={archiveSoloStreakIsLoading}
                                            title="Archive"
                                        />
                                        <ErrorMessage message={archiveSoloStreakErrorMessage} />
                                    </Spacer>
                                </>
                            ) : (
                                <>
                                    <Spacer>
                                        <Button
                                            onPress={() => {
                                                restoreArchivedSoloStreak(selectedSoloStreak._id);
                                                this.props.navigation.pop();
                                            }}
                                            buttonStyle={{ backgroundColor: 'green' }}
                                            loading={restoreArchivedSoloStreakIsLoading}
                                            title="Restore"
                                        />
                                    </Spacer>
                                    <Spacer>
                                        <Button
                                            onPress={() => {
                                                deleteArchivedSoloStreak({ soloStreakId: selectedSoloStreak._id });
                                                this.props.navigation.pop();
                                            }}
                                            buttonStyle={{ backgroundColor: 'red' }}
                                            loading={deleteArchivedSoloStreakIsLoading}
                                            title="Delete"
                                        />
                                        <ErrorMessage message={deleteArchivedSoloStreakErrorMessage} />
                                    </Spacer>
                                </>
                            )
                        ) : null}
                    </ScrollView>
                )}
            </>
        );
    }
}

const SoloStreakInfoScreen = connect(mapStateToProps, mapDispatchToProps)(SoloStreakInfoScreenComponent);

export { SoloStreakInfoScreen };
