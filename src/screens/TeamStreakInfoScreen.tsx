import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { AppState } from '../../store';

import { AppActions, getStreakCompletionInfo } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import NativePushNotification from 'react-native-push-notification';

import { teamStreakActions, teamMemberStreakTaskActions, userActions } from '../actions/authenticatedSharedActions';
import { Text, Button, ListItem, Divider, Card } from 'react-native-elements';
import { LoadingScreenSpinner } from '../components/LoadingScreenSpinner';
import { Spacer } from '../components/Spacer';
import { Screens } from './Screens';
import { ErrorMessage } from '../components/ErrorMessage';
import { ScrollView, FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { TeamNotes } from '../components/TeamNotes';
import { GeneralActivityFeed } from '../components/GeneralActivityFeed';
import { StyleSheet, Picker, View, ActivityIndicator } from 'react-native';
import { CustomTeamStreakReminderPushNotification } from '@streakoid/streakoid-models/lib/Models/PushNotifications';
import { CustomTeamStreakReminder, CustomStreakReminder } from '@streakoid/streakoid-models/lib/Models/StreakReminders';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAbacus, faCog, faBell } from '@fortawesome/pro-solid-svg-icons';
import PushNotificationTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationTypes';
import StreakReminderTypes from '@streakoid/streakoid-models/lib/Types/StreakReminderTypes';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { StreakFlame } from '../components/StreakFlame';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../screenNavigation/RootNavigator';

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
    completeTeamMemberStreakTask: bindActionCreators(
        teamMemberStreakTaskActions.completeTeamMemberStreakTask,
        dispatch,
    ),
    incompleteTeamMemberStreakTask: bindActionCreators(
        teamMemberStreakTaskActions.incompleteTeamMemberStreakTask,
        dispatch,
    ),
    updateCurrentUserPushNotification: bindActionCreators(userActions.updateCurrentUserPushNotifications, dispatch),
    updateCustomTeamStreakReminder: bindActionCreators(
        teamStreakActions.updateCustomTeamStreakReminderPushNotification,
        dispatch,
    ),
});

type TeamStreakInfoScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.TeamStreakInfo>;
type TeamStreakInfoScreenRouteProp = RouteProp<RootStackParamList, Screens.TeamStreakInfo>;

type NavigationProps = {
    navigation: TeamStreakInfoScreenNavigationProp;
    route: TeamStreakInfoScreenRouteProp;
};

const styles = StyleSheet.create({
    itemTitle: {
        fontSize: 15,
    },
});

type Props = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    NavigationProps & { isFocused: boolean };

class TeamStreakInfoScreenComponent extends PureComponent<Props> {
    componentDidMount() {
        this.props.getSelectedTeamStreak(this.props.route.params._id);
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.route.params._id !== this.props.route.params._id) {
            this.props.getSelectedTeamStreak(this.props.route.params._id);
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
        const teamStreakId = this.props.route.params._id;
        const teamStreakName = this.props.route.params.streakName;
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
        if (!selectedTeamStreak) return null;
        const isCurrentUserAMemberOfTeamStreak = selectedTeamStreak.members.some(
            (member) => member._id === currentUser._id,
        );
        const { pastStreaks, currentStreak, timezone, createdAt } = selectedTeamStreak;
        const streakCompletionInfo = getStreakCompletionInfo({
            pastStreaks,
            currentStreak,
            timezone,
            createdAt: new Date(createdAt),
        });
        const daysSinceUserCompletedStreak = streakCompletionInfo && streakCompletionInfo.daysSinceUserCompletedStreak;
        const daysSinceUserCreatedStreak = streakCompletionInfo && streakCompletionInfo.daysSinceUserCreatedStreak;
        const negativeDayStreak = daysSinceUserCompletedStreak || daysSinceUserCreatedStreak || 0;
        const currentMember = selectedTeamStreak.members.find((member) => member._id == currentUser._id);
        const selectedTeamMemberStreak = currentMember && currentMember.teamMemberStreak;
        return (
            <>
                {getTeamStreakIsLoading ? (
                    <LoadingScreenSpinner />
                ) : (
                    <ScrollView>
                        {selectedTeamMemberStreak && selectedTeamStreak.isCurrentUserApartOfTeamStreak ? (
                            selectedTeamStreak.status === StreakStatus.live ? (
                                selectedTeamStreak.hasCurrentUserCompletedTaskForTheDay ? (
                                    <Spacer>
                                        <Button
                                            title="Incomplete"
                                            buttonStyle={{ backgroundColor: 'red' }}
                                            loading={selectedTeamMemberStreak.incompleteTeamMemberStreakTaskIsLoading}
                                            onPress={() =>
                                                this.props.incompleteTeamMemberStreakTask({
                                                    teamStreakId: selectedTeamStreak._id,
                                                    teamMemberStreakId: selectedTeamMemberStreak._id,
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
                                                this.props.completeTeamMemberStreakTask({
                                                    teamStreakId: selectedTeamStreak._id,
                                                    teamMemberStreakId: selectedTeamMemberStreak._id,
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
                            <StreakFlame
                                currentStreakNumberOfDaysInARow={currentStreak.numberOfDaysInARow}
                                negativeDayStreak={negativeDayStreak}
                            />
                        </Spacer>
                        <Spacer>
                            <Text style={{ fontWeight: 'bold' }}> Team Members </Text>
                            <FlatList
                                data={selectedTeamStreak.members}
                                keyExtractor={(teamMember) => teamMember._id}
                                renderItem={({ item, index }) => {
                                    const { username, profileImage, teamMemberStreak } = item;
                                    const { currentStreak, longestStreak, completedToday } = teamMemberStreak;
                                    return (
                                        <>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.props.navigation.navigate(Screens.TeamMemberStreakInfo, {
                                                        _id: item.teamMemberStreak._id,
                                                        streakName: this.props.route.params.streakName,
                                                    })
                                                }
                                            >
                                                <ListItem
                                                    leftElement={<Text>#{index + 1}</Text>}
                                                    chevron={true}
                                                    leftAvatar={{
                                                        overlayContainerStyle: {
                                                            borderWidth: 2,
                                                            borderColor: completedToday ? 'green' : 'red',
                                                            overflow: 'hidden',
                                                        },
                                                        source: { uri: profileImage },
                                                    }}
                                                    title={username}
                                                    subtitle={
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <StreakFlame
                                                                currentStreakNumberOfDaysInARow={
                                                                    currentStreak.numberOfDaysInARow
                                                                }
                                                                negativeDayStreak={negativeDayStreak}
                                                            />
                                                            <View style={{ flexDirection: 'row', marginLeft: 5 }}>
                                                                <Text style={{ fontWeight: 'bold' }}>
                                                                    {longestStreak}
                                                                </Text>
                                                                <FontAwesomeIcon icon={faCrown} color={'gold'} />
                                                            </View>
                                                        </View>
                                                    }
                                                ></ListItem>

                                                <Spacer />
                                            </TouchableOpacity>
                                            <Divider />
                                        </>
                                    );
                                }}
                            />
                        </Spacer>
                        {isCurrentUserAMemberOfTeamStreak ? (
                            <>
                                <Spacer>
                                    <Button
                                        buttonStyle={{ backgroundColor: 'green' }}
                                        title="Add team member"
                                        onPress={() => this.props.navigation.push(Screens.AddUserToTeamStreak)}
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
                                        onPress={() => this.props.navigation.push(Screens.AddNoteToTeamStreak)}
                                    />
                                    <TeamNotes
                                        navigation={this.props.navigation}
                                        subjectId={this.props.route.params._id}
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
                            <Text style={{ fontWeight: 'bold' }}>Activity Feed</Text>
                            <Spacer />
                            <GeneralActivityFeed
                                navigation={this.props.navigation}
                                activityFeedItems={selectedTeamStreak.activityFeed.activityFeedItems}
                                currentUserId={this.props.currentUser._id}
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
                                            onPress={() => {
                                                this.archiveTeamStreak({
                                                    selectedTeamStreakId: selectedTeamStreak._id,
                                                });
                                                this.props.navigation.pop();
                                            }}
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
                                            onPress={() => {
                                                restoreArchivedTeamStreak(selectedTeamStreak._id);
                                                this.props.navigation.pop();
                                            }}
                                            buttonStyle={{ backgroundColor: 'green' }}
                                            loading={restoreArchivedTeamStreakIsLoading}
                                            title="Restore"
                                        />
                                        <ErrorMessage message={restoreArchivedTeamStreakErrorMessage} />
                                    </Spacer>
                                    <Spacer>
                                        <Button
                                            onPress={() => {
                                                deleteArchivedTeamStreak(selectedTeamStreak._id);
                                                this.props.navigation.pop();
                                            }}
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

const TeamStreakInfoScreen = connect(mapStateToProps, mapDispatchToProps)(TeamStreakInfoScreenComponent);

export { TeamStreakInfoScreen };
