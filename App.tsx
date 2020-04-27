import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider, connect } from 'react-redux';

import { store, persistor, AppState } from './store';
import { AuthBottomTabNavigator } from './src/screenNavigation/AuthBottomTabNavigator';
import { PayingMemberDrawer } from './src/screenNavigation/PayingMemberDrawer';
import { FreeMemberDrawer } from './src/screenNavigation/FreeMemberDrawer';
import { IntroStack } from './src/screenNavigation/IntroStack';
import NavigationService from './src/screens/NavigationService';
import { LoadingScreenSpinner } from './src/components/LoadingScreenSpinner';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import {
    soloStreakActions,
    challengeStreakActions,
    teamStreakActions,
    userActions,
    authActions,
} from './src/actions/sharedActions';
import { ActivityIndicator } from 'react-native';
import { AppState as ReactNativeAppState } from 'react-native';

import { PushNotificationType } from '@streakoid/streakoid-sdk/lib/models/PushNotifications';
import { Screens } from './src/screens/Screens';
import PushNotificationTypes from '@streakoid/streakoid-sdk/lib/PushNotificationTypes';

const unauthenticatedSwitchNavigator = createSwitchNavigator({
    auth: AuthBottomTabNavigator,
    mainFlow: PayingMemberDrawer,
});

const authenticatedPayingMemberSwitchNavigator = createSwitchNavigator({
    mainFlow: PayingMemberDrawer,
    auth: AuthBottomTabNavigator,
});

const authenticatedFreeMemberSwitchNavigator = createSwitchNavigator({
    mainFlow: FreeMemberDrawer,
    auth: AuthBottomTabNavigator,
});

const UnauthenticatedAppContainerComponent = createAppContainer(unauthenticatedSwitchNavigator);
const AuthenticatedPayingMemberAppContainerComponent = createAppContainer(authenticatedPayingMemberSwitchNavigator);
const AuthenticatedFreeMemberAppContainerComponent = createAppContainer(authenticatedFreeMemberSwitchNavigator);
const IntroAppContainerComponent = createAppContainer(IntroStack);

const mapStateToProps = (state: AppState) => {
    const isAuthenticated = state && state.auth && state.auth.isAuthenticated;
    const hasCompletedIntroduction =
        state && state.users && state.users.currentUser && state.users.currentUser.hasCompletedIntroduction;
    const isPayingMember =
        state &&
        state.users &&
        state.users.currentUser &&
        state.users.currentUser.membershipInformation &&
        state.users.currentUser.membershipInformation.isPayingMember;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rehydrated = (state as any)._persist.rehydrated;
    const currentUser = state && state.users && state.users.currentUser;
    return { isAuthenticated, hasCompletedIntroduction, isPayingMember, rehydrated, currentUser };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    updateCurrentUser: bindActionCreators(userActions.updateCurrentUser, dispatch),
    getSoloStreak: bindActionCreators(soloStreakActions.getSoloStreak, dispatch),
    getChallengeStreak: bindActionCreators(challengeStreakActions.getChallengeStreak, dispatch),
    getTeamStreak: bindActionCreators(teamStreakActions.getSelectedTeamStreak, dispatch),
    logoutUser: bindActionCreators(authActions.logoutUser, dispatch),
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class AppContainerComponent extends React.Component<Props> {
    componentDidMount = async () => {
        //Notifications.addListener(this._handleNotification);
        // if (Constants.isDevice) {
        //     const hasPermission = await this.askPermissionForNotifications();
        //     if (hasPermission) {
        //         //const pushNotificationToken = await Notifications.getExpoPushTokenAsync();
        //         if (isAuthenticated) {
        //             //this.props.updateCurrentUser({ pushNotificationToken });
        //         }
        //     }
        // }
        // ErrorUtils &&
        //     ErrorUtils.setGlobalHandler((error, isFatal) => {
        //         if (isFatal) {
        //             this.props.logoutUser();
        //         }
        //     });
    };

    _handleNotification = async (notification: Notification) => {
        const pushNotification: PushNotificationType = notification.data;
        // if (notification.origin === 'received') {
        //     Vibration.vibrate(100);
        // }

        if (ReactNativeAppState.currentState === 'background') {
            if (pushNotification.pushNotificationType == PushNotificationTypes.customSoloStreakReminder) {
                return NavigationService.navigate(Screens.SoloStreakInfo, {
                    _id: pushNotification.soloStreakId,
                    streakName: pushNotification.soloStreakName,
                });
            }

            if (pushNotification.pushNotificationType === PushNotificationTypes.customChallengeStreakReminder) {
                return NavigationService.navigate(Screens.ChallengeStreakInfo, {
                    _id: pushNotification.challengeStreakId,
                    streakName: pushNotification.challengeName,
                });
            }

            if (pushNotification.pushNotificationType === PushNotificationTypes.customTeamStreakReminder) {
                return NavigationService.navigate(Screens.TeamStreakInfo, {
                    _id: pushNotification.teamStreakId,
                    streakName: pushNotification.teamStreakName,
                });
            }

            if (pushNotification.pushNotificationType === PushNotificationTypes.completeAllStreaksReminder) {
                return NavigationService.navigate(Screens.Home);
            }

            if (pushNotification.pushNotificationType === PushNotificationTypes.completedTeamStreakUpdate) {
                return NavigationService.navigate(Screens.TeamStreakInfo, {
                    _id: pushNotification.teamStreakId,
                    streakName: pushNotification.teamStreakName,
                });
            }

            if (pushNotification.pushNotificationType === PushNotificationTypes.incompletedTeamStreakUpdate) {
                return NavigationService.navigate(Screens.TeamStreakInfo, {
                    _id: pushNotification.teamStreakId,
                    streakName: pushNotification.teamStreakName,
                });
            }

            if (pushNotification.pushNotificationType === PushNotificationTypes.addedNoteToTeamStreak) {
                return NavigationService.navigate(Screens.TeamStreakInfo, {
                    _id: pushNotification.teamStreakId,
                    streakName: pushNotification.teamStreakName,
                });
            }

            if (pushNotification.pushNotificationType === PushNotificationTypes.newFollower) {
                return NavigationService.navigate(Screens.UserProfile, {
                    _id: pushNotification.followerId,
                    username: pushNotification.followerUsername,
                });
            }

            if (pushNotification.pushNotificationType === PushNotificationTypes.unlockedAchievement) {
                return NavigationService.navigate(Screens.Account);
            }
        }
    };

    askPermissionForNotifications = async () => {
        return true;
    };

    render() {
        const { isAuthenticated, rehydrated, hasCompletedIntroduction, isPayingMember } = this.props;

        if (isAuthenticated && rehydrated) {
            if (hasCompletedIntroduction) {
                if (isPayingMember) {
                    return (
                        <AuthenticatedPayingMemberAppContainerComponent
                            ref={(navigatorRef) => {
                                NavigationService.setTopLevelNavigator(navigatorRef);
                            }}
                        />
                    );
                } else {
                    return (
                        <AuthenticatedFreeMemberAppContainerComponent
                            ref={(navigatorRef) => {
                                NavigationService.setTopLevelNavigator(navigatorRef);
                            }}
                        />
                    );
                }
            }

            return (
                <IntroAppContainerComponent
                    ref={(navigatorRef) => {
                        NavigationService.setTopLevelNavigator(navigatorRef);
                    }}
                />
            );
        }

        if (rehydrated) {
            return (
                <UnauthenticatedAppContainerComponent
                    ref={(navigatorRef) => {
                        NavigationService.setTopLevelNavigator(navigatorRef);
                    }}
                />
            );
        }

        return <LoadingScreenSpinner />;
    }
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(AppContainerComponent);

export default class App extends React.Component {
    render(): JSX.Element {
        return (
            <Provider store={store}>
                <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
                    <AppContainer />
                </PersistGate>
            </Provider>
        );
    }
}
