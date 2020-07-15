/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider, connect } from 'react-redux';

import { store, persistor, AppState } from './store';
import { ErrorBoundary } from './ErrorBoundary';
import { NoInternetBoundary } from './NoInternetBoundary';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { ActivityIndicator, Platform, View } from 'react-native';

import NativePushNotification from 'react-native-push-notification';
import analytics from '@segment/analytics-react-native';
import GoogleAnalytics from '@segment/analytics-react-native-google-analytics';
import Mixpanel from '@segment/analytics-react-native-mixpanel';

import { enableScreens } from 'react-native-screens';
import { userActions } from './src/actions/authenticatedSharedActions';
import { NavigationContainer } from '@react-navigation/native';
import { getDrawerMenu } from './src/screenNavigation/DrawerMenu';
import { navigationRef, NavigationService } from './NavigationService';
import { UnauthenticatedStackNavigator } from './src/screenNavigation/UnauthenticatedStack';
import { PushNotificationType } from '@streakoid/streakoid-models/lib/Models/PushNotifications';
import PushNotificationTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationTypes';
import { Screens } from './src/screens/Screens';
import {
    SoloStreakInfoRouteParams,
    ChallengeStreakInfoRouteParams,
    TeamStreakInfoRouteParams,
    UserProfileRouteParams,
    AccountRouteParams,
} from './src/screenNavigation/RootNavigator';
import SplashScreen from 'react-native-splash-screen';

enableScreens();

const mapStateToProps = (state: AppState) => {
    const isAuthenticated = state && state.auth && state.auth.isAuthenticated;
    const hasCompletedOnboarding =
        state && state.users && state.users.currentUser && state.users.currentUser.hasCompletedOnboarding;
    const isPayingMember =
        state &&
        state.users &&
        state.users.currentUser &&
        state.users.currentUser.membershipInformation &&
        state.users.currentUser.membershipInformation.isPayingMember;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rehydrated = (state as any)._persist.rehydrated;
    const currentUser = state && state.users && state.users.currentUser;
    return { isAuthenticated, hasCompletedOnboarding, isPayingMember, rehydrated, currentUser };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    updateCurrentUser: bindActionCreators(userActions.updateCurrentUser, dispatch),
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class AppContainerComponent extends React.PureComponent<Props> {
    componentDidMount = async () => {
        SplashScreen.hide();
        analytics.setup('bn5p5VLmYRJ5oWE1z4xkmTGcb3DflWYg', {
            using: [GoogleAnalytics, Mixpanel],
            trackAppLifecycleEvents: true,
            trackAttributionData: true,
            android: {
                collectDeviceId: true,
            },
        });
        const googleSenderId = '392167142636';
        NativePushNotification.configure({
            senderID: googleSenderId,
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },
            requestPermissions: true,
            onRegister: (tokenData) => {
                const { token, os } = tokenData;

                if (!token) {
                    return;
                }
                const { currentUser } = this.props;
                const androidToken = currentUser.pushNotification.androidToken;
                const iosToken = currentUser.pushNotification.iosToken;

                if (token === androidToken || token === iosToken) {
                    return;
                }

                if (os === 'android') {
                    this.props.updateCurrentUser({
                        updateData: {
                            pushNotification: {
                                androidToken: token,
                            },
                        },
                    });
                }
                if (os === 'ios') {
                    this.props.updateCurrentUser({
                        updateData: {
                            pushNotification: {
                                iosToken: token,
                            },
                        },
                    });
                }
            },
            onNotification: (notification) => {
                if (Platform.OS === 'ios') {
                    this._handleNotification({
                        pushNotification: notification.data as PushNotificationType,
                    });
                } else {
                    this._handleNotification({
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        pushNotification: notification as any,
                    });
                }
            },
        });
    };

    _handleNotification = async ({ pushNotification }: { pushNotification: PushNotificationType }) => {
        if ((pushNotification as any).foreground) {
            return;
        }

        if (pushNotification.pushNotificationType == PushNotificationTypes.customSoloStreakReminder) {
            const params: SoloStreakInfoRouteParams = {
                _id: pushNotification.soloStreakId,
                streakName: pushNotification.soloStreakName,
                isUsersStreak: true,
            };
            return NavigationService.navigate({
                screen: Screens.SoloStreakInfo,
                params,
            });
        }

        if (pushNotification.pushNotificationType === PushNotificationTypes.customChallengeStreakReminder) {
            const params: ChallengeStreakInfoRouteParams = {
                _id: pushNotification.challengeStreakId,
                challengeName: pushNotification.challengeName,
            };
            return NavigationService.navigate({
                screen: Screens.ChallengeStreakInfo,
                params,
            });
        }

        if (pushNotification.pushNotificationType === PushNotificationTypes.customTeamStreakReminder) {
            const params: TeamStreakInfoRouteParams = {
                _id: pushNotification.teamStreakId,
                streakName: pushNotification.teamStreakName,
                userIsApartOfStreak: true,
            };
            return NavigationService.navigate({
                screen: Screens.TeamStreakInfo,
                params,
            });
        }

        if (pushNotification.pushNotificationType === PushNotificationTypes.completeAllStreaksReminder) {
            return NavigationService.navigate({ screen: Screens.Home });
        }

        if (pushNotification.pushNotificationType === PushNotificationTypes.completedTeamStreakUpdate) {
            const params: TeamStreakInfoRouteParams = {
                _id: pushNotification.teamStreakId,
                streakName: pushNotification.teamStreakName,
                userIsApartOfStreak: true,
            };
            return NavigationService.navigate({
                screen: Screens.TeamStreakInfo,
                params,
            });
        }

        if (pushNotification.pushNotificationType === PushNotificationTypes.incompletedTeamStreakUpdate) {
            const params: TeamStreakInfoRouteParams = {
                _id: pushNotification.teamStreakId,
                streakName: pushNotification.teamStreakName,
                userIsApartOfStreak: true,
            };
            return NavigationService.navigate({
                screen: Screens.TeamStreakInfo,
                params,
            });
        }

        if (pushNotification.pushNotificationType === PushNotificationTypes.newFollower) {
            const profileImage =
                this.props.currentUser &&
                this.props.currentUser.profileImages &&
                this.props.currentUser.profileImages.originalImageUrl;
            const params: UserProfileRouteParams = {
                _id: pushNotification.followerId,
                username: pushNotification.followerUsername,
                profileImage,
            };
            return NavigationService.navigate({
                screen: Screens.UserProfile,
                params,
            });
        }

        if (pushNotification.pushNotificationType === PushNotificationTypes.unlockedAchievement) {
            const params: AccountRouteParams = {
                username: this.props.currentUser.username,
            };
            return NavigationService.navigate({ screen: Screens.Account, params });
        }

        if (pushNotification.pushNotificationType === PushNotificationTypes.joinedTeamStreak) {
            const params: TeamStreakInfoRouteParams = {
                _id: pushNotification.teamStreakId,
                streakName: pushNotification.teamStreakName,
                userIsApartOfStreak: true,
            };
            return NavigationService.navigate({
                screen: Screens.TeamStreakInfo,
                params,
            });
        }
    };

    render() {
        const { isAuthenticated, isPayingMember } = this.props;
        const drawerMenu = getDrawerMenu({ isPayingMember, platformIsIOS: Platform.OS === 'ios' });
        return isAuthenticated ? drawerMenu : <UnauthenticatedStackNavigator />;
    }
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(AppContainerComponent);

const MyTheme = {
    dark: false,
    colors: {
        primary: 'blue',
        background: 'white',
        card: 'rgb(255, 255, 255)',
        text: 'rgb(28, 28, 30)',
        border: 'rgb(199, 199, 204)',
    },
};

const App = () => {
    return (
        <Provider store={store}>
            <NavigationContainer ref={navigationRef as any} theme={MyTheme}>
                <PersistGate
                    loading={
                        <View
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <ActivityIndicator size={'large'} />
                        </View>
                    }
                    persistor={persistor}
                >
                    <ErrorBoundary>
                        <NoInternetBoundary>
                            <AppContainer />
                        </NoInternetBoundary>
                    </ErrorBoundary>
                </PersistGate>
            </NavigationContainer>
        </Provider>
    );
};

export default App;
