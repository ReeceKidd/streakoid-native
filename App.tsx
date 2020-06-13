/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider, connect } from 'react-redux';

import { store, persistor, AppState } from './store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { ActivityIndicator, Platform, View } from 'react-native';

import NativePushNotification from 'react-native-push-notification';
import analytics from '@segment/analytics-react-native';
import GoogleAnalytics from '@segment/analytics-react-native-google-analytics';
import Mixpanel from '@segment/analytics-react-native-mixpanel';

import { enableScreens } from 'react-native-screens';
import PushNotificationSupportedDeviceTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationSupportedDeviceTypes';
import { userActions } from './src/actions/authenticatedSharedActions';
import { NavigationContainer } from '@react-navigation/native';
import { getDrawerMenu } from './src/screenNavigation/DrawerMenu';
import { navigationRef } from './NavigationService';

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
        analytics.setup('bn5p5VLmYRJ5oWE1z4xkmTGcb3DflWYg', {
            using: [GoogleAnalytics, Mixpanel],
            trackAppLifecycleEvents: true,
            trackAttributionData: true,
            android: {
                collectDeviceId: true,
            },
        });

        const { isAuthenticated } = this.props;
        if (isAuthenticated) {
            NativePushNotification.configure({
                onRegister: (tokenData) => {
                    const { token } = tokenData;
                    const { currentUser } = this.props;
                    const pushNotificationToken = currentUser && currentUser.pushNotification.token;
                    const endpointArn = currentUser && currentUser.pushNotification.endpointArn;
                    if (token === pushNotificationToken && endpointArn) {
                        return;
                    }
                    const deviceType =
                        Platform.OS === 'ios'
                            ? PushNotificationSupportedDeviceTypes.ios
                            : PushNotificationSupportedDeviceTypes.android;
                    this.props.updateCurrentUser({
                        updateData: {
                            pushNotification: {
                                token: String(token),
                                deviceType,
                            },
                        },
                    });
                },
                permissions: {
                    alert: true,
                    badge: true,
                    sound: true,
                },
            });
        }
    };

    render() {
        const { isAuthenticated, isPayingMember } = this.props;
        return getDrawerMenu({ isAuthenticated, isPayingMember });
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

const App = () => (
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
                {/* <ErrorBoundary> */}
                <AppContainer />
                {/* </ErrorBoundary> */}
            </PersistGate>
        </NavigationContainer>
    </Provider>
);

export default App;
