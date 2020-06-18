import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { Text, ListItem } from 'react-native-elements';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    AppState as ReactNativeAppState,
} from 'react-native';

import {
    soloStreakActions,
    userActions,
    teamStreakActions,
    teamMemberStreakTaskActions,
    challengeStreakActions,
} from '../actions/authenticatedSharedActions';
import { AppState } from '../../store';
import { Spacer } from '../components/Spacer';
import { LiveSoloStreakList } from '../components/LiveSoloStreakList';
import { LiveChallengeStreakList } from '../components/LiveChallengeStreakList';
import { Screens } from './Screens';
import { PushNotificationType } from '@streakoid/streakoid-models/lib/Models/PushNotifications';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import PushNotificationTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationTypes';
import StreakReminderTypes from '@streakoid/streakoid-models/lib/Types/StreakReminderTypes';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faChild,
    faPeopleCarry,
    faMedal,
    faLifeRing,
    faExclamation,
    faUserCrown,
} from '@fortawesome/pro-solid-svg-icons';
import { LiveTeamStreakList } from '../components/LiveTeamStreakList';
import NativePushNotification from 'react-native-push-notification';
import * as RNLocalize from 'react-native-localize';
import { tz } from 'moment-timezone';
import { MaximumNumberOfFreeStreaksMessage } from '../components/MaximumNumberOfFreeStreaksMessage';
import analytics from '@segment/analytics-react-native';
import { ProgressBar } from '../components/ProgressBar';
import { getCompletePercentageForStreaks } from '../helpers/getCompletePercentageForStreaks';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import { getAccountCompletionPercentage } from '@streakoid/streakoid-shared/lib/helpers/progress/getAccountCompletionPercentage';

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
    const totalIncompleteStreaks =
        incompleteSoloStreaks.length + incompleteTeamStreaks.length + incompleteChallengeStreaks.length;
    const totalNumberOfSoloStreaks =
        state && state.soloStreaks && state.soloStreaks.liveSoloStreaks && state.soloStreaks.liveSoloStreaks.length;
    const totalNumberOfTeamStreaks =
        state && state.teamStreaks && state.teamStreaks.liveTeamStreaks && state.teamStreaks.liveTeamStreaks.length;
    const totalNumberOfChallengeStreaks = state.challengeStreaks.liveChallengeStreaks.length;
    const isPayingMember =
        currentUser && currentUser.membershipInformation && currentUser.membershipInformation.isPayingMember;
    const hasCompletedTutorial = currentUser && currentUser.hasCompletedTutorial;
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
        totalIncompleteStreaks,
        totalNumberOfSoloStreaks,
        totalNumberOfTeamStreaks,
        totalNumberOfChallengeStreaks,
        isPayingMember,
        hasCompletedTutorial,
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
    updateChallengeStreaksTimezones: bindActionCreators(
        challengeStreakActions.updateChallengeStreakTimezones,
        dispatch,
    ),
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

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.Home>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, Screens.Home>;

type NavigationProps = {
    navigation: HomeScreenNavigationProp;
    route: HomeScreenRouteProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class HomeScreenComponent extends PureComponent<Props> {
    componentDidMount = async () => {
        this.props.getCurrentUser();
        this.props.getLiveSoloStreaks();
        this.props.getLiveChallengeStreaks();
        this.props.getLiveTeamStreaks();
        this.initializePushNotifications();
        const currentTimezone = RNLocalize.getTimeZone();
        const { currentUser } = this.props;
        if (currentUser && currentUser._id) {
            analytics.alias(currentUser._id);
            //analytics.identify(currentUser._id, { email: currentUser.email, username: currentUser.username });
        }
        if (currentUser && currentUser.timezone !== currentTimezone) {
            this.props.updateCurrentUser({ updateData: { timezone: currentTimezone } });
            this.displayTimezoneChangeAlert({ oldTimezone: currentUser.timezone, currentTimezone });
            this.props.updateSoloStreaksTimezones(currentTimezone);
            this.props.updateChallengeStreaksTimezones(currentTimezone);
        }
        ReactNativeAppState.addEventListener('change', this._handleAppStateChange);
    };

    componentWillUnmount() {
        ReactNativeAppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState: string) => {
        if (nextAppState === 'active') {
            this.props.getLiveSoloStreaks();
            this.props.getLiveChallengeStreaks();
            this.props.getLiveTeamStreaks();
        }
    };

    displayTimezoneChangeAlert({
        oldTimezone,
        currentTimezone,
    }: {
        oldTimezone: string;
        currentTimezone: string;
    }): void {
        const oldTimezoneOffset = tz(oldTimezone).utcOffset();
        const currentTimezoneOffset = tz(currentTimezone).utcOffset();
        const diffInHours = (currentTimezoneOffset - oldTimezoneOffset) / 60;

        const alertMessage = `Your timezone has changed from ${oldTimezone} to ${currentTimezone}. Your solo and challenge streaks will now use this timezone. Time difference is ${
            diffInHours >= 0 ? `+${diffInHours}` : `${diffInHours}`
        } hours.`;

        Alert.alert('Timezone change', alertMessage);
    }

    initializePushNotifications = async () => {
        NativePushNotification.cancelAllLocalNotifications();
        const { currentUser } = this.props;
        const { pushNotifications } = currentUser;
        const { completeAllStreaksReminder, customStreakReminders } = pushNotifications;
        if (pushNotifications) {
            if (completeAllStreaksReminder && completeAllStreaksReminder.enabled) {
                const newExpoId = await this.scheduleDailyPush({
                    title: 'Complete streaks reminder',
                    body: 'Your reminder to complete your streaks for today.',
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
            navigation,
        } = this.props;
        return (
            <>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.push(Screens.ChallengeStreaks)}>
                        <Text style={{ fontWeight: 'bold' }}>
                            Challenge Streaks <FontAwesomeIcon icon={faMedal} />
                        </Text>
                    </TouchableOpacity>
                    {getMultipleLiveChallengeStreaksIsLoading ? <ActivityIndicator style={{ marginLeft: 10 }} /> : null}
                </View>
                <View style={{ marginTop: 5 }}>
                    <ProgressBar
                        completePercentage={getCompletePercentageForStreaks({
                            numberOfIncompleteStreaks: incompleteChallengeStreaks && incompleteChallengeStreaks.length,
                            numberOfStreaks: totalNumberOfChallengeStreaks,
                        })}
                        fullScreen={false}
                    />
                </View>
                <LiveChallengeStreakList
                    getChallengeStreak={getChallengeStreak}
                    getLiveChallengeStreaks={getLiveChallengeStreaks}
                    getMultipleLiveChallengeStreaksIsLoading={getMultipleLiveChallengeStreaksIsLoading}
                    completeChallengeStreakListTask={completeChallengeStreakListTask}
                    incompleteChallengeStreakListTask={incompleteChallengeStreakListTask}
                    liveChallengeStreaks={incompleteChallengeStreaks}
                    totalNumberOfChallengeStreaks={totalNumberOfChallengeStreaks}
                    navigation={navigation}
                    userId={userId}
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
                    <TouchableOpacity onPress={() => this.props.navigation.push(Screens.TeamStreaks)}>
                        <Text style={{ fontWeight: 'bold' }}>
                            Team Streaks <FontAwesomeIcon icon={faPeopleCarry} />
                        </Text>
                    </TouchableOpacity>
                    {getMultipleLiveTeamStreaksIsLoading ? <ActivityIndicator style={{ marginLeft: 10 }} /> : null}
                </View>
                <View style={{ marginTop: 5 }}>
                    <ProgressBar
                        completePercentage={getCompletePercentageForStreaks({
                            numberOfIncompleteStreaks: incompleteTeamStreaks && incompleteTeamStreaks.length,
                            numberOfStreaks: totalNumberOfTeamStreaks,
                        })}
                        fullScreen={false}
                    />
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

    renderIncompleteSoloStreaks(): JSX.Element {
        const {
            currentUser,
            getSoloStreak,
            completeSoloStreakListTask,
            incompleteSoloStreakListTask,
            incompleteSoloStreaks,
            getMultipleLiveSoloStreaksIsLoading,
            totalNumberOfSoloStreaks,
        } = this.props;
        return (
            <>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <TouchableOpacity
                        onPress={() =>
                            this.props.navigation.navigate(Screens.SoloStreaks, {
                                getMultipleLiveSoloStreaksIsLoading: false,
                                isPayingMember: true,
                                totalLiveStreaks: 0,
                            })
                        }
                    >
                        <Text style={{ fontWeight: 'bold' }}>
                            Solo Streaks <FontAwesomeIcon icon={faChild} />
                        </Text>
                    </TouchableOpacity>

                    {getMultipleLiveSoloStreaksIsLoading ? <ActivityIndicator style={{ marginLeft: 10 }} /> : null}
                </View>
                <View style={{ marginTop: 5 }}>
                    <ProgressBar
                        completePercentage={getCompletePercentageForStreaks({
                            numberOfIncompleteStreaks: incompleteSoloStreaks && incompleteSoloStreaks.length,
                            numberOfStreaks: totalNumberOfSoloStreaks,
                        })}
                        fullScreen={false}
                    />
                </View>
                <LiveSoloStreakList
                    userId={currentUser._id}
                    getSoloStreak={getSoloStreak}
                    completeSoloStreakListTask={completeSoloStreakListTask}
                    incompleteSoloStreakListTask={incompleteSoloStreakListTask}
                    liveSoloStreaks={incompleteSoloStreaks}
                    getMultipleLiveSoloStreaksIsLoading={getMultipleLiveSoloStreaksIsLoading}
                    totalNumberOfSoloStreaks={totalNumberOfSoloStreaks}
                    navigation={this.props.navigation}
                />
            </>
        );
    }

    render(): JSX.Element {
        const { currentUser, isPayingMember, totalIncompleteStreaks } = this.props;
        const totalLiveStreaks = currentUser && currentUser.totalLiveStreaks;
        return (
            <ScrollView style={styles.container}>
                <View>
                    <ProgressBar
                        completePercentage={getCompletePercentageForStreaks({
                            numberOfIncompleteStreaks: totalIncompleteStreaks,
                            numberOfStreaks: totalLiveStreaks,
                        })}
                        fullScreen={true}
                    />
                    {currentUser.userType === UserTypes.temporary ? (
                        <ListItem
                            containerStyle={{ backgroundColor: 'yellow' }}
                            leftIcon={<FontAwesomeIcon icon={faExclamation} />}
                            title={'To login you need to register an email and password.'}
                            chevron={true}
                            onPress={() => {
                                this.props.navigation.navigate(Screens.WhatIsYourEmail);
                            }}
                        />
                    ) : null}
                    {!isPayingMember ? (
                        <Spacer>
                            <MaximumNumberOfFreeStreaksMessage
                                isPayingMember={isPayingMember}
                                totalLiveStreaks={totalLiveStreaks}
                            />
                        </Spacer>
                    ) : null}
                    <Spacer>{this.renderIncompleteChallengeStreaks()}</Spacer>
                    <Spacer>{this.renderIncompleteTeamStreaks()}</Spacer>
                    <Spacer>{this.renderIncompleteSoloStreaks()}</Spacer>
                    {!currentUser.hasCompletedTutorial ? (
                        <ListItem
                            style={{ marginTop: 10 }}
                            leftIcon={<FontAwesomeIcon icon={faLifeRing} color={'red'} />}
                            title={'Confused? Go to the tutorial'}
                            chevron={true}
                            onPress={() => {
                                this.props.updateCurrentUser({
                                    updateData: { hasCompletedTutorial: true },
                                });
                                this.props.navigation.navigate(Screens.WhatIsAStreak);
                            }}
                        />
                    ) : null}
                    {getAccountCompletionPercentage({ currentUser }) < 100 ? (
                        <ListItem
                            style={{ marginTop: 10 }}
                            leftIcon={<FontAwesomeIcon icon={faUserCrown} color={'gold'} />}
                            title={'Customize your account'}
                            chevron={true}
                            onPress={() => {
                                this.props.navigation.navigate(Screens.WhatIsYourFirstName);
                            }}
                        />
                    ) : null}
                </View>
            </ScrollView>
        );
    }
}

const HomeScreen = connect(mapStateToProps, mapDispatchToProps)(HomeScreenComponent);

export { HomeScreen };
