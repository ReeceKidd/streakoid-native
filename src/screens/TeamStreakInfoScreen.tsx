import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { AppState } from '../../store';

import { AppActions, getStreakCompletionString } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import NativePushNotification from 'react-native-push-notification';

import { teamStreakActions, teamMemberStreakTaskActions, userActions } from '../actions/sharedActions';
import { NavigationScreenProp, NavigationState, NavigationEvents, withNavigationFocus } from 'react-navigation';
import { Text, Button, ListItem, Divider, Card } from 'react-native-elements';
import { LoadingScreenSpinner } from '../components/LoadingScreenSpinner';
import { Spacer } from '../components/Spacer';
import NavigationService from './NavigationService';
import { Screens } from './Screens';
import { TeamStreakDetails } from '../components/TeamStreakDetails';
import { ErrorMessage } from '../components/ErrorMessage';
import { ScrollView, FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { TeamNotes } from '../components/TeamNotes';
import { GeneralActivityFeed } from '../components/GeneralActivityFeed';
import { StyleSheet, Picker, View, ActivityIndicator, Share } from 'react-native';
import { CustomTeamStreakReminderPushNotification } from '@streakoid/streakoid-models/lib/Models/PushNotifications';
import { CustomTeamStreakReminder, CustomStreakReminder } from '@streakoid/streakoid-models/lib/Models/StreakReminders';
import { streakoidUrl } from '../streakoidUrl';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit, faShareAlt, faAbacus, faCog, faBell } from '@fortawesome/pro-solid-svg-icons';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import PushNotificationTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationTypes';
import StreakReminderTypes from '@streakoid/streakoid-models/lib/Types/StreakReminderTypes';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { faCrown } from '@fortawesome/free-solid-svg-icons';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    const selectedTeamStreak = state && state.teamStreaks && state.teamStreaks.selectedTeamStreak;
    const selectedTeamStreakNumberOfDaysInARow =
        selectedTeamStreak && selectedTeamStreak.currentStreak && selectedTeamStreak.currentStreak.numberOfDaysInARow;
    const selectedTeamStreakTimezone =
        selectedTeamStreak && selectedTeamStreak.currentStreak && selectedTeamStreak.timezone;
    const getTeamStreakIsLoading = state && state.teamStreaks && state.teamStreaks.getTeamStreakIsLoading;
    const archiveTeamStreakErrorMessage = state && state.teamStreaks && state.teamStreaks.archiveTeamStreakErrorMessage;
    const archiveTeamStreakIsLoading = state && state.teamStreaks && state.teamStreaks.archiveTeamStreakIsLoading;
    const restoreArchivedTeamStreakErrorMessage =
        state && state.teamStreaks && state.teamStreaks.restoreArchivedTeamStreakErrorMessage;
    const restoreArchivedTeamStreakIsLoading =
        state && state.teamStreaks && state.teamStreaks.restoreArchivedTeamStreakIsLoading;
    const deleteArchivedTeamStreakErrorMessage =
        state && state.teamStreaks && state.teamStreaks.deleteArchivedTeamStreakErrorMessage;
    const deleteArchivedTeamStreakIsLoading =
        state && state.teamStreaks && state.teamStreaks.deleteArchivedTeamStreakIsLoading;
    return {
        currentUser,
        selectedTeamStreak,
        selectedTeamStreakNumberOfDaysInARow,
        selectedTeamStreakTimezone,
        getTeamStreakIsLoading,
        archiveTeamStreakErrorMessage,
        archiveTeamStreakIsLoading,
        restoreArchivedTeamStreakErrorMessage,
        restoreArchivedTeamStreakIsLoading,
        deleteArchivedTeamStreakErrorMessage,
        deleteArchivedTeamStreakIsLoading,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getSelectedTeamStreak: bindActionCreators(teamStreakActions.getSelectedTeamStreak, dispatch),
    archiveTeamStreak: bindActionCreators(teamStreakActions.archiveTeamStreak, dispatch),
    clearArchiveTeamStreakErrorMessage: bindActionCreators(
        teamStreakActions.clearArchiveTeamStreakErrorMessage,
        dispatch,
    ),
    restoreArchivedTeamStreak: bindActionCreators(teamStreakActions.restoreArchivedTeamStreak, dispatch),
    deleteArchivedTeamStreak: bindActionCreators(teamStreakActions.deleteArchivedTeamStreak, dispatch),
    completeSelectedTeamMemberStreakTask: bindActionCreators(
        teamMemberStreakTaskActions.completeSelectedTeamMemberStreakTask,
        dispatch,
    ),
    incompleteSelectedTeamMemberStreakTask: bindActionCreators(
        teamMemberStreakTaskActions.incompleteSelectedTeamMemberStreakTask,
        dispatch,
    ),
    updateCurrentUserPushNotification: bindActionCreators(userActions.updateCurrentUserPushNotifications, dispatch),
    updateCustomTeamStreakReminder: bindActionCreators(
        teamStreakActions.updateCustomTeamStreakReminderPushNotification,
        dispatch,
    ),
});

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, { _id: string; streakName: string }>;
}

const styles = StyleSheet.create({
    itemTitle: {
        fontSize: 15,
    },
});

type Props = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    NavigationProps & { isFocused: boolean };

class TeamStreakInfoScreenComponent extends PureComponent<Props> {
    static navigationOptions = ({
        navigation,
    }: {
        navigation: NavigationScreenProp<
            NavigationState,
            { _id: string; streakName: string; userIsApartOfStreak: boolean }
        >;
    }) => {
        const streakId = navigation.getParam('_id');
        const streakName = navigation.getParam('streakName');
        const userIsApartOfStreak = navigation.getParam('userIsApartOfStreak');
        return {
            title: streakName,
            headerRight: (
                <View style={{ flexDirection: 'row' }}>
                    {userIsApartOfStreak ? (
                        <Button
                            type="clear"
                            icon={<FontAwesomeIcon icon={faEdit} />}
                            onPress={() => NavigationService.navigate(Screens.EditTeamStreak)}
                        />
                    ) : null}
                    <Button
                        type="clear"
                        icon={<FontAwesomeIcon icon={faShareAlt} />}
                        onPress={async () => {
                            await Share.share({
                                message: `View team streak ${streakName} at ${streakoidUrl}/${RouterCategories.teamStreaks}/${streakId}`,
                                url: `${streakoidUrl}/${RouterCategories.teamStreaks}/${streakId}`,
                                title: `View Streakoid team streak ${streakName}`,
                            });
                        }}
                    />
                </View>
            ),
        };
    };

    componentDidMount() {
        this.props.getSelectedTeamStreak(this.props.navigation.getParam('_id'));
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.navigation.getParam('_id') !== this.props.navigation.getParam('_id')) {
            this.props.getSelectedTeamStreak(this.props.navigation.getParam('_id'));
        }
    }

    componentWillUnmount() {
        this.props.clearArchiveTeamStreakErrorMessage();
    }

    scheduleDailyPush = async ({
        title,
        body,
        reminderHour,
        reminderMinute,
        teamStreakId,
        teamStreakName,
    }: {
        title: string;
        body: string;
        reminderHour: number;
        reminderMinute: number;
        teamStreakId: string;
        teamStreakName: string;
    }) => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const date = currentDate.getDate();
        const data: CustomTeamStreakReminderPushNotification = {
            pushNotificationType: PushNotificationTypes.customTeamStreakReminder,
            teamStreakId,
            teamStreakName,
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

    updateCustomTeamStreakReminder = async ({
        reminderHour,
        reminderMinute,
        enabled,
    }: {
        reminderHour: number;
        reminderMinute: number;
        enabled: boolean;
    }) => {
        const teamStreakId = this.props.navigation.getParam('_id');
        const teamStreakName = this.props.navigation.getParam('streakName');
        const customStreakReminders = this.props.currentUser.pushNotifications.customStreakReminders;
        const customCompleteTeamMemberStreakReminder = customStreakReminders.find(
            (pushNotification) =>
                pushNotification.streakReminderType === StreakReminderTypes.customTeamStreakReminder &&
                pushNotification.teamStreakId == teamStreakId,
        );
        if (customCompleteTeamMemberStreakReminder) {
            await NativePushNotification.cancelLocalNotifications({
                id: customCompleteTeamMemberStreakReminder.expoId,
            });
        }
        if (enabled) {
            const newExpoId = await this.scheduleDailyPush({
                title: `Complete ${teamStreakName}!`,
                body: `Don't let your team down.`,
                reminderHour,
                reminderMinute,
                teamStreakId,
                teamStreakName,
            });

            const newCustomTeamStreakReminder: CustomTeamStreakReminder = {
                expoId: String(newExpoId),
                reminderHour,
                reminderMinute,
                enabled,
                streakReminderType: StreakReminderTypes.customTeamStreakReminder,
                teamStreakName,
                teamStreakId,
            };
            const customStreakRemindersWithoutOldReminder = customStreakReminders.filter(
                (pushNotification) =>
                    !(
                        pushNotification.streakReminderType === StreakReminderTypes.customTeamStreakReminder &&
                        pushNotification.teamStreakId === teamStreakId
                    ),
            );

            const newCustomStreakReminders: CustomStreakReminder[] = [
                ...customStreakRemindersWithoutOldReminder,
                newCustomTeamStreakReminder,
            ];
            this.props.updateCustomTeamStreakReminder({
                customTeamStreakReminder: newCustomTeamStreakReminder,
            });
            this.props.updateCurrentUserPushNotification({
                customStreakReminders: newCustomStreakReminders,
            });
        } else {
            if (customCompleteTeamMemberStreakReminder) {
                const customStreakRemindersWithoutOldReminder = customStreakReminders.filter(
                    (pushNotification) =>
                        !(
                            pushNotification.streakReminderType === StreakReminderTypes.customTeamStreakReminder &&
                            pushNotification.teamStreakId === teamStreakId
                        ),
                );
                const updatedCustomTeamStreakReminder: CustomTeamStreakReminder = {
                    ...customCompleteTeamMemberStreakReminder,
                    streakReminderType: StreakReminderTypes.customTeamStreakReminder,
                    teamStreakName,
                    teamStreakId,
                    reminderHour,
                    reminderMinute,
                    enabled,
                };
                const newCustomStreakReminders: CustomStreakReminder[] = [
                    ...customStreakRemindersWithoutOldReminder,
                    updatedCustomTeamStreakReminder,
                ];
                this.props.updateCustomTeamStreakReminder({
                    customTeamStreakReminder: updatedCustomTeamStreakReminder,
                });
                this.props.updateCurrentUserPushNotification({
                    customStreakReminders: newCustomStreakReminders,
                });
            }
        }
    };

    renderCustomStreakReminderOptions() {
        const title = 'Complete team streak reminder';
        const customTeamStreakReminder = this.props.selectedTeamStreak.customTeamStreakReminder;
        const enabled = (customTeamStreakReminder && customTeamStreakReminder.enabled) || false;
        const reminderHour = (customTeamStreakReminder && customTeamStreakReminder.reminderHour) || 21;
        const reminderMinute = (customTeamStreakReminder && customTeamStreakReminder.reminderMinute) || 0;
        return (
            <ListItem
                title={title}
                titleStyle={styles.itemTitle}
                leftIcon={<FontAwesomeIcon icon={faBell} color={enabled ? 'blue' : 'gray'} />}
                onPress={() => {
                    this.updateCustomTeamStreakReminder({
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
        const customTeamStreakReminder = this.props.selectedTeamStreak.customTeamStreakReminder;
        const enabled = (customTeamStreakReminder && customTeamStreakReminder.enabled) || false;
        const reminderHour = (customTeamStreakReminder && customTeamStreakReminder.reminderHour) || 21;
        const reminderMinute = (customTeamStreakReminder && customTeamStreakReminder.reminderMinute) || 0;
        return (
            <Picker
                selectedValue={reminderHour}
                onValueChange={(value) => {
                    this.updateCustomTeamStreakReminder({
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
        const customTeamStreakReminder = this.props.selectedTeamStreak.customTeamStreakReminder;
        const enabled = (customTeamStreakReminder && customTeamStreakReminder.enabled) || false;
        const reminderHour = (customTeamStreakReminder && customTeamStreakReminder.reminderHour) || 21;
        const reminderMinute = (customTeamStreakReminder && customTeamStreakReminder.reminderMinute) || 0;
        return (
            <Picker
                selectedValue={reminderMinute}
                onValueChange={(value) => {
                    this.updateCustomTeamStreakReminder({
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

    archiveTeamStreak = async ({ selectedTeamStreakId }: { selectedTeamStreakId: string }) => {
        const { archiveTeamStreak } = this.props;
        archiveTeamStreak(selectedTeamStreakId);
    };

    render(): JSX.Element | null {
        const {
            currentUser,
            getSelectedTeamStreak,
            getTeamStreakIsLoading,
            selectedTeamStreak,
            archiveTeamStreakIsLoading,
            archiveTeamStreakErrorMessage,
            restoreArchivedTeamStreak,
            restoreArchivedTeamStreakErrorMessage,
            restoreArchivedTeamStreakIsLoading,
            deleteArchivedTeamStreak,
            deleteArchivedTeamStreakIsLoading,
            deleteArchivedTeamStreakErrorMessage,
        } = this.props;
        const teamStreakId = this.props.navigation.getParam('_id');
        if (!selectedTeamStreak) return null;
        const isCurrentUserAMemberOfTeamStreak = selectedTeamStreak.members.some(
            (member) => member._id === currentUser._id,
        );
        const streakCompletionString = getStreakCompletionString({
            pastStreaks: selectedTeamStreak.pastStreaks,
            currentStreak: selectedTeamStreak.currentStreak,
            timezone: selectedTeamStreak.timezone,
            createdAt: new Date(selectedTeamStreak.createdAt),
        });
        const currentMember = selectedTeamStreak.members.find((member) => member._id == currentUser._id);
        const selectedTeamMemberStreak = currentMember && currentMember.teamMemberStreak;
        return (
            <>
                {getTeamStreakIsLoading ? (
                    <LoadingScreenSpinner />
                ) : (
                    <ScrollView>
                        <NavigationEvents
                            onWillFocus={() => {
                                getSelectedTeamStreak(teamStreakId);
                            }}
                        />
                        {selectedTeamMemberStreak && selectedTeamStreak.isCurrentUserApartOfTeamStreak ? (
                            selectedTeamStreak.status === StreakStatus.live ? (
                                selectedTeamStreak.hasCurrentUserCompletedTaskForTheDay ? (
                                    <Spacer>
                                        <Button
                                            title="Incomplete"
                                            buttonStyle={{ backgroundColor: 'red' }}
                                            loading={selectedTeamMemberStreak.incompleteTeamMemberStreakTaskIsLoading}
                                            onPress={() =>
                                                this.props.incompleteSelectedTeamMemberStreakTask({
                                                    teamStreakId: selectedTeamStreak._id,
                                                    selectedTeamMemberStreakId: selectedTeamMemberStreak._id,
                                                })
                                            }
                                        />
                                    </Spacer>
                                ) : (
                                    <Spacer>
                                        <Button
                                            title="Complete"
                                            loading={selectedTeamMemberStreak.completeTeamMemberStreakTaskIsLoading}
                                            onPress={() =>
                                                this.props.completeSelectedTeamMemberStreakTask({
                                                    teamStreakId: selectedTeamStreak._id,
                                                    selectedTeamMemberStreakId: selectedTeamMemberStreak._id,
                                                })
                                            }
                                        />
                                    </Spacer>
                                )
                            ) : null
                        ) : null}
                        <Spacer>
                            {selectedTeamStreak.status === StreakStatus.live ? (
                                <Text style={{ color: 'green' }}>Live</Text>
                            ) : (
                                <Text style={{ color: 'red' }}>Archived</Text>
                            )}
                            <Text style={{ color: streakCompletionString.error ? 'red' : 'green' }}>
                                {streakCompletionString.string}
                            </Text>
                        </Spacer>
                        <TeamStreakDetails
                            selectedTeamStreak={selectedTeamStreak}
                            navigate={this.props.navigation.navigate}
                        />
                        {isCurrentUserAMemberOfTeamStreak ? (
                            <>
                                <Spacer>
                                    <Button
                                        buttonStyle={{ backgroundColor: 'green' }}
                                        title="Add follower"
                                        onPress={() => NavigationService.navigate(Screens.AddFollowerToTeamStreak)}
                                    />
                                </Spacer>
                                {selectedTeamStreak.status === StreakStatus.live ? (
                                    <Spacer>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold' }}>{`Notifications `}</Text>
                                            {currentUser.updatePushNotificationsIsLoading ? (
                                                <ActivityIndicator />
                                            ) : null}
                                        </View>
                                        {this.renderCustomStreakReminderOptions()}
                                        {selectedTeamStreak.customTeamStreakReminder?.enabled
                                            ? this.renderReminderTime()
                                            : null}
                                    </Spacer>
                                ) : null}
                                <Spacer>
                                    <Text style={{ fontWeight: 'bold' }}>Notes</Text>
                                    <Spacer />
                                    <Button
                                        title="Add note"
                                        onPress={() => NavigationService.navigate(Screens.AddNoteToTeamStreak)}
                                    />
                                    <TeamNotes
                                        navigation={this.props.navigation}
                                        subjectId={this.props.navigation.getParam('_id')}
                                    />
                                </Spacer>
                            </>
                        ) : null}
                        <Spacer>
                            <Text style={{ fontWeight: 'bold' }}>Stats</Text>
                            <Card>
                                <FontAwesomeIcon icon={faCrown} />
                                <Text style={{ textAlign: 'center' }}>Longest Ever Streak</Text>
                                <Text h4 style={{ textAlign: 'center' }}>
                                    {selectedTeamStreak.longestStreak}
                                </Text>
                            </Card>
                            <Card>
                                <FontAwesomeIcon icon={faAbacus} />
                                <Text style={{ textAlign: 'center' }}>Total Times Tracked</Text>
                                <Text h4 style={{ textAlign: 'center' }}>
                                    {selectedTeamStreak.totalTimesTracked}
                                </Text>
                            </Card>
                        </Spacer>
                        <Spacer>
                            <Text style={{ fontWeight: 'bold' }}> Team Members </Text>
                            <FlatList
                                data={selectedTeamStreak.members}
                                keyExtractor={(teamMember) => teamMember._id}
                                renderItem={({ item, index }) => {
                                    const { username, profileImage, teamMemberStreak } = item;
                                    const { currentStreak, totalTimesTracked, longestStreak } = teamMemberStreak;
                                    const currentStreakText =
                                        currentStreak.numberOfDaysInARow !== 1
                                            ? `${currentStreak.numberOfDaysInARow.toString()} days`
                                            : `${currentStreak.numberOfDaysInARow.toString()} day`;
                                    const longestStreakText =
                                        longestStreak !== 1
                                            ? `Longest streak: ${longestStreak} days`
                                            : `Longest streak: ${longestStreak} day`;
                                    const totalTimesTrackedText =
                                        totalTimesTracked !== 1
                                            ? `Total times tracked: ${totalTimesTracked} times`
                                            : `Total times tracked: ${totalTimesTracked} time`;
                                    return (
                                        <>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.props.navigation.navigate(Screens.TeamMemberStreakInfo, {
                                                        _id: item.teamMemberStreak._id,
                                                        streakName: this.props.navigation.getParam('streakName'),
                                                    })
                                                }
                                            >
                                                <ListItem
                                                    leftElement={<Text>#{index + 1}</Text>}
                                                    leftAvatar={{
                                                        source: { uri: profileImage },
                                                    }}
                                                    title={username}
                                                    subtitle={currentStreakText}
                                                ></ListItem>
                                                <Text>{longestStreakText}</Text>
                                                <Text>{totalTimesTrackedText}</Text>
                                                <Spacer />
                                            </TouchableOpacity>
                                            <Divider />
                                        </>
                                    );
                                }}
                            />
                        </Spacer>
                        <Spacer>
                            <Text style={{ fontWeight: 'bold' }}>Activity Feed</Text>
                            <Spacer />
                            <GeneralActivityFeed
                                navigation={this.props.navigation}
                                activityFeedItems={selectedTeamStreak.activityFeed.activityFeedItems}
                            />
                        </Spacer>
                        <Text h3 h3Style={{ textAlign: 'center' }}>
                            <FontAwesomeIcon icon={faCog} size={40} />
                        </Text>
                        <Spacer />
                        {isCurrentUserAMemberOfTeamStreak ? (
                            selectedTeamStreak.status === StreakStatus.live ? (
                                <>
                                    <Spacer>
                                        <Button
                                            onPress={() =>
                                                this.archiveTeamStreak({ selectedTeamStreakId: selectedTeamStreak._id })
                                            }
                                            buttonStyle={{ backgroundColor: 'red' }}
                                            loading={archiveTeamStreakIsLoading}
                                            title="Archive"
                                        />
                                        <ErrorMessage message={archiveTeamStreakErrorMessage} />
                                    </Spacer>
                                </>
                            ) : (
                                <>
                                    <Spacer>
                                        <Button
                                            onPress={() => restoreArchivedTeamStreak(selectedTeamStreak._id)}
                                            buttonStyle={{ backgroundColor: 'green' }}
                                            loading={restoreArchivedTeamStreakIsLoading}
                                            title="Restore"
                                        />
                                        <ErrorMessage message={restoreArchivedTeamStreakErrorMessage} />
                                    </Spacer>
                                    <Spacer>
                                        <Button
                                            onPress={() => deleteArchivedTeamStreak(selectedTeamStreak._id)}
                                            buttonStyle={{ backgroundColor: 'red' }}
                                            loading={deleteArchivedTeamStreakIsLoading}
                                            title="Delete"
                                        />
                                        <ErrorMessage message={deleteArchivedTeamStreakErrorMessage} />
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

const TeamStreakInfoScreen = withNavigationFocus(
    connect(mapStateToProps, mapDispatchToProps)(TeamStreakInfoScreenComponent),
);

export { TeamStreakInfoScreen };
