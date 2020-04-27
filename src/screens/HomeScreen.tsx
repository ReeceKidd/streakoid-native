import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
    NavigationScreenProp,
    NavigationState,
    NavigationParams,
    ScrollView,
    NavigationEvents,
} from 'react-navigation';
import { Text, Button } from 'react-native-elements';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

import {
    soloStreakActions,
    userActions,
    teamStreakActions,
    teamMemberStreakTaskActions,
    challengeStreakActions,
} from '../actions/sharedActions';
import { AppState } from '../../store';
import { Spacer } from '../components/Spacer';
import { LiveSoloStreakList } from '../components/LiveSoloStreakList';
import { HamburgerSelector } from '../components/HamburgerSelector';
import { LiveChallengeStreakList } from '../components/LiveChallengeStreakList';
import NavigationService from './NavigationService';
import { Screens } from './Screens';
import { PushNotificationType } from '@streakoid/streakoid-sdk/lib/models/PushNotifications';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import PushNotificationTypes from '@streakoid/streakoid-sdk/lib/PushNotificationTypes';
import StreakReminderTypes from '@streakoid/streakoid-sdk/lib/StreakReminderTypes';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChild, faPeopleCarry, faMedal } from '@fortawesome/pro-solid-svg-icons';
import { LiveTeamStreakList } from '../components/LiveTeamStreakList';

const getIncompleteSoloStreaks = (state: AppState) => {
    return (
        state &&
        state.soloStreaks &&
        state.soloStreaks.liveSoloStreaks &&
        state.soloStreaks.liveSoloStreaks.filter(
            (soloStreak) => !soloStreak.completedToday && soloStreak.status === StreakStatus.live,
        )
    );
};

const getIncompleteTeamStreaks = (state: AppState) => {
    return (
        state &&
        state.teamStreaks &&
        state.teamStreaks.liveTeamStreaks &&
        state.teamStreaks.liveTeamStreaks.filter(
            (teamStreak) => !teamStreak.completedToday && teamStreak.status === StreakStatus.live,
        )
    );
};

const getIncompleteChallengeStreaks = (state: AppState) => {
    return (
        state &&
        state.challengeStreaks &&
        state.challengeStreaks.liveChallengeStreaks &&
        state.challengeStreaks.liveChallengeStreaks.filter(
            (challengeStreak) => !challengeStreak.completedToday && challengeStreak.status === StreakStatus.live,
        )
    );
};

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    const getSoloStreakIsLoading = state && state.soloStreaks && state.soloStreaks.getSoloStreakIsLoading;
    const getMultipleLiveSoloStreaksIsLoading = state && state.soloStreaks.getMultipleLiveSoloStreaksIsLoading;
    const getMultipleLiveTeamStreaksIsLoading =
        state && state.teamStreaks && state.teamStreaks.getMultipleLiveTeamStreaksIsLoading;
    const getMultipleLiveChallengeStreaksIsLoading =
        state.challengeStreaks && state.challengeStreaks.getMultipleLiveChallengeStreaksIsLoading;
    const incompleteSoloStreaks = getIncompleteSoloStreaks(state);
    const incompleteTeamStreaks = getIncompleteTeamStreaks(state);
    const incompleteChallengeStreaks = getIncompleteChallengeStreaks(state);
    const totalNumberOfSoloStreaks =
        state && state.soloStreaks && state.soloStreaks.liveSoloStreaks && state.soloStreaks.liveSoloStreaks.length;
    const totalNumberOfTeamStreaks =
        state && state.teamStreaks && state.teamStreaks.liveTeamStreaks && state.teamStreaks.liveTeamStreaks.length;
    const totalNumberOfChallengeStreaks = state.challengeStreaks.liveChallengeStreaks.length;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rehydrated = (state as any)._persist.rehydrated;
    return {
        currentUser,
        getSoloStreakIsLoading,
        incompleteSoloStreaks,
        getMultipleLiveSoloStreaksIsLoading,
        userId: currentUser && currentUser._id,
        incompleteTeamStreaks,
        getMultipleLiveTeamStreaksIsLoading,
        incompleteChallengeStreaks,
        getMultipleLiveChallengeStreaksIsLoading,
        totalNumberOfSoloStreaks,
        totalNumberOfTeamStreaks,
        totalNumberOfChallengeStreaks,
        rehydrated,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getLiveSoloStreaks: bindActionCreators(soloStreakActions.getLiveSoloStreaks, dispatch),
    getSoloStreak: bindActionCreators(soloStreakActions.getSoloStreak, dispatch),
    completeSoloStreakListTask: bindActionCreators(soloStreakActions.completeSoloStreakListTask, dispatch),
    incompleteSoloStreakListTask: bindActionCreators(soloStreakActions.incompleteSoloStreakListTask, dispatch),
    getCurrentUser: bindActionCreators(userActions.getCurrentUser, dispatch),
    updateCurrentUser: bindActionCreators(userActions.updateCurrentUser, dispatch),
    updateSoloStreaksTimezones: bindActionCreators(soloStreakActions.updateSoloStreakTimezones, dispatch),
    getLiveTeamStreaks: bindActionCreators(teamStreakActions.getLiveTeamStreaks, dispatch),
    getSelectedTeamStreak: bindActionCreators(teamStreakActions.getSelectedTeamStreak, dispatch),
    completeTeamMemberStreakTask: bindActionCreators(
        teamMemberStreakTaskActions.completeTeamMemberStreakTask,
        dispatch,
    ),
    incompleteTeamMemberStreakTask: bindActionCreators(
        teamMemberStreakTaskActions.incompleteTeamMemberStreakTask,
        dispatch,
    ),
    completeChallengeStreakListTask: bindActionCreators(
        challengeStreakActions.completeChallengeStreakListTask,
        dispatch,
    ),
    incompleteChallengeStreakListTask: bindActionCreators(
        challengeStreakActions.incompleteChallengeStreakListTask,
        dispatch,
    ),
    getLiveChallengeStreaks: bindActionCreators(challengeStreakActions.getLiveChallengeStreaks, dispatch),
    getChallengeStreak: bindActionCreators(challengeStreakActions.getChallengeStreak, dispatch),
    updateCurrentUserPushNotifications: bindActionCreators(userActions.updateCurrentUserPushNotifications, dispatch),
});

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    NavigationProps & { isFocused: boolean };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class HomeScreenComponent extends Component<Props> {
    static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationState, {}> }) => {
        return {
            headerLeft: () => <HamburgerSelector navigation={navigation} />,
        };
    };

    componentDidMount = async () => {
        this.props.getCurrentUser();
        const { hasCompletedIntroduction } = this.props.currentUser;
        if (!hasCompletedIntroduction) {
            NavigationService.navigate(Screens.Welcome);
        }
    };

    initializePushNotifications = async () => {
        await this.askPermissionForNotifications();
        //await Notifications.cancelAllScheduledNotificationsAsync();
        const { currentUser } = this.props;
        const { pushNotifications } = currentUser;
        const { completeAllStreaksReminder, customStreakReminders } = pushNotifications;
        if (pushNotifications) {
            if (completeAllStreaksReminder && completeAllStreaksReminder.enabled) {
                const newExpoId = await this.scheduleDailyPush({
                    title: 'Complete your streaks!',
                    body: 'Complete your streaks before Oid finds out',
                    reminderHour: completeAllStreaksReminder.reminderHour,
                    reminderMinute: completeAllStreaksReminder.reminderMinute,
                    data: {
                        pushNotificationType: PushNotificationTypes.completeAllStreaksReminder,
                    },
                });
                this.props.updateCurrentUserPushNotifications({
                    completeAllStreaksReminder: {
                        ...completeAllStreaksReminder,
                        expoId: String(newExpoId),
                    },
                });
            }
            const updatedCustomStreakReminders = await Promise.all(
                customStreakReminders.map(async (reminder) => {
                    if (reminder.enabled) {
                        if (reminder.streakReminderType === StreakReminderTypes.customSoloStreakReminder) {
                            const { soloStreakName, soloStreakId, reminderHour, reminderMinute } = reminder;
                            const expoId = await this.scheduleDailyPush({
                                title: `Complete your solo streak!`,
                                body: `Complete ${soloStreakName}.`,
                                reminderHour,
                                reminderMinute,
                                data: {
                                    pushNotificationType: PushNotificationTypes.customSoloStreakReminder,
                                    soloStreakId,
                                    soloStreakName,
                                },
                            });
                            return {
                                ...reminder,
                                expoId: String(expoId),
                            };
                        }

                        if (reminder.streakReminderType === StreakReminderTypes.customChallengeStreakReminder) {
                            const { challengeName, reminderHour, reminderMinute, challengeStreakId } = reminder;
                            const expoId = await this.scheduleDailyPush({
                                title: `Complete your challenge streak!`,
                                body: `Complete ${reminder.challengeName}.`,
                                reminderHour,
                                reminderMinute,
                                data: {
                                    pushNotificationType: PushNotificationTypes.customChallengeStreakReminder,
                                    challengeName,
                                    challengeStreakId,
                                },
                            });
                            return {
                                ...reminder,
                                expoId: String(expoId),
                            };
                        }

                        if (reminder.streakReminderType === StreakReminderTypes.customTeamStreakReminder) {
                            const { teamStreakId, teamStreakName, reminderHour, reminderMinute } = reminder;
                            const expoId = await this.scheduleDailyPush({
                                title: `Complete ${teamStreakName}!`,
                                body: `Don't let your team down.`,
                                reminderHour,
                                reminderMinute,
                                data: {
                                    pushNotificationType: PushNotificationTypes.customTeamStreakReminder,
                                    teamStreakId,
                                    teamStreakName,
                                },
                            });
                            return {
                                ...reminder,
                                expoId: String(expoId),
                            };
                        }
                    }
                    return reminder;
                }),
            );
            this.props.updateCurrentUserPushNotifications({ customStreakReminders: updatedCustomStreakReminders });
        }
    };

    askPermissionForNotifications = async () => {
        // const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        // let finalStatus = existingStatus;
        // if (existingStatus !== 'granted') {
        //     const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        //     finalStatus = status;
        // }
        // if (finalStatus !== 'granted') {
        //     return false;
        // }
        return true;
    };

    scheduleDailyPush = async ({
        title,
        body,
        reminderHour,
        reminderMinute,
        data,
    }: {
        title: string;
        body: string;
        reminderHour: number;
        reminderMinute: number;
        data: PushNotificationType;
    }) => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const date = currentDate.getDate();
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
        // const repeat = 'day';
        // // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // const schedulingOptions = { time: scheduleTime, repeat } as any;
        // return Notifications.scheduleLocalNotificationAsync(dailyPushNotification, schedulingOptions);
    };

    getCompletePercentageForStreaks({
        numberOfStreaks,
        numberOfIncompleteStreaks,
    }: {
        numberOfStreaks: number;
        numberOfIncompleteStreaks: number;
    }): number {
        const incompletePercentage = (numberOfIncompleteStreaks / numberOfStreaks) * 100;
        const displayPercentage = 100 - incompletePercentage;
        return displayPercentage;
    }

    renderIncompleteSoloStreaks(): JSX.Element {
        const {
            currentUser,
            getSoloStreak,
            getLiveSoloStreaks,
            completeSoloStreakListTask,
            incompleteSoloStreakListTask,
            incompleteSoloStreaks,
            getMultipleLiveSoloStreaksIsLoading,
            totalNumberOfSoloStreaks,
        } = this.props;
        return (
            <>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <TouchableOpacity onPress={() => NavigationService.navigate(Screens.SoloStreaks)}>
                        <Text style={{ fontWeight: 'bold' }}>
                            Solo Streaks <FontAwesomeIcon icon={faChild} size={20} />
                        </Text>
                    </TouchableOpacity>

                    {getMultipleLiveSoloStreaksIsLoading ? <ActivityIndicator style={{ marginLeft: 10 }} /> : null}
                </View>

                <LiveSoloStreakList
                    userId={currentUser._id}
                    navigation={this.props.navigation}
                    getSoloStreak={getSoloStreak}
                    getLiveSoloStreaks={getLiveSoloStreaks}
                    completeSoloStreakListTask={completeSoloStreakListTask}
                    incompleteSoloStreakListTask={incompleteSoloStreakListTask}
                    liveSoloStreaks={incompleteSoloStreaks}
                    getMultipleLiveSoloStreaksIsLoading={getMultipleLiveSoloStreaksIsLoading}
                    totalNumberOfSoloStreaks={totalNumberOfSoloStreaks}
                />
            </>
        );
    }

    renderIncompleteTeamStreaks(): JSX.Element {
        const {
            getSelectedTeamStreak,
            getLiveTeamStreaks,
            getMultipleLiveTeamStreaksIsLoading,
            completeTeamMemberStreakTask,
            incompleteTeamMemberStreakTask,
            incompleteTeamStreaks,
            userId,
            totalNumberOfTeamStreaks,
        } = this.props;
        return (
            <>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <TouchableOpacity onPress={() => NavigationService.navigate(Screens.TeamStreaks)}>
                        <Text style={{ fontWeight: 'bold' }}>
                            Team Streaks <FontAwesomeIcon icon={faPeopleCarry} size={20} />
                        </Text>
                    </TouchableOpacity>
                    {getMultipleLiveTeamStreaksIsLoading ? <ActivityIndicator style={{ marginLeft: 10 }} /> : null}
                </View>
                <LiveTeamStreakList
                    getTeamStreak={getSelectedTeamStreak}
                    getLiveTeamStreaks={getLiveTeamStreaks}
                    getMultipleLiveTeamStreaksIsLoading={getMultipleLiveTeamStreaksIsLoading}
                    completeTeamMemberStreakTask={completeTeamMemberStreakTask}
                    incompleteTeamMemberStreakTask={incompleteTeamMemberStreakTask}
                    teamStreaks={incompleteTeamStreaks}
                    userId={userId}
                    totalNumberOfTeamStreaks={totalNumberOfTeamStreaks}
                    navigation={this.props.navigation}
                />
            </>
        );
    }

    renderIncompleteChallengeStreaks(): JSX.Element {
        const {
            completeChallengeStreakListTask,
            incompleteChallengeStreakListTask,
            incompleteChallengeStreaks,
            totalNumberOfChallengeStreaks,
            getChallengeStreak,
            getLiveChallengeStreaks,
            getMultipleLiveChallengeStreaksIsLoading,
            userId,
        } = this.props;
        return (
            <>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <TouchableOpacity onPress={() => NavigationService.navigate(Screens.ChallengeStreaks)}>
                        <Text style={{ fontWeight: 'bold' }}>
                            Challenge Streaks <FontAwesomeIcon icon={faMedal} size={20} />
                        </Text>
                    </TouchableOpacity>
                    {getMultipleLiveChallengeStreaksIsLoading ? <ActivityIndicator style={{ marginLeft: 10 }} /> : null}
                </View>
                <LiveChallengeStreakList
                    getChallengeStreak={getChallengeStreak}
                    getLiveChallengeStreaks={getLiveChallengeStreaks}
                    getMultipleLiveChallengeStreaksIsLoading={getMultipleLiveChallengeStreaksIsLoading}
                    completeChallengeStreakListTask={completeChallengeStreakListTask}
                    incompleteChallengeStreakListTask={incompleteChallengeStreakListTask}
                    liveChallengeStreaks={incompleteChallengeStreaks}
                    totalNumberOfChallengeStreaks={totalNumberOfChallengeStreaks}
                    navigation={this.props.navigation}
                    userId={userId}
                />
            </>
        );
    }

    render(): JSX.Element {
        return (
            <ScrollView style={styles.container}>
                <View>
                    <NavigationEvents
                        onWillFocus={() => {
                            this.props.getCurrentUser();
                            this.initializePushNotifications();
                        }}
                    />
                    <Spacer>{this.renderIncompleteSoloStreaks()}</Spacer>
                    <Spacer>{this.renderIncompleteTeamStreaks()}</Spacer>
                    <Spacer>{this.renderIncompleteChallengeStreaks()}</Spacer>
                    <Spacer>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Need Recommendations?</Text>
                        <Spacer />
                        <Button
                            buttonStyle={{ backgroundColor: 'green' }}
                            title="Get Recommendations"
                            onPress={() => NavigationService.navigate(Screens.StreakRecommendations)}
                        />
                    </Spacer>
                </View>
            </ScrollView>
        );
    }
}

const HomeScreen = connect(mapStateToProps, mapDispatchToProps)(HomeScreenComponent);

export { HomeScreen };
