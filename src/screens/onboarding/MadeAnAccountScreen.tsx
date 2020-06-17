import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../../store';

import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Spacer } from '../../components/Spacer';
import { Text, Button, Avatar } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Screens } from '../Screens';
import uuid from 'react-native-uuid';
import { Dispatch, bindActionCreators } from 'redux';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { StackNavigationProp } from '@react-navigation/stack';
import { LoadingScreenSpinner } from '../../components/LoadingScreenSpinner';
import { authActions } from '../../actions/authActions';
import { UnauthenticatedStackParamList } from '../../screenNavigation/UnauthenticatedStack';

const mapStateToProps = (state: AppState) => {
    const isAuthenticated = state && state.auth && state.auth.isAuthenticated;
    const currentUser = state && state.users && state.users.currentUser;
    const profileImage = currentUser && currentUser.profileImages && currentUser.profileImages.originalImageUrl;
    const username = currentUser && currentUser.username;
    const temporaryPassword =
        state && state.users && state.users.currentUser && state.users.currentUser.temporaryPassword;
    const loginIsLoading = state && state.auth && state.auth.loginIsLoading;
    const registerWithUserIdentifierIsLoading = state && state.auth && state.auth.registerWithIdentifierUserIsLoading;
    return {
        isAuthenticated,
        profileImage,
        username,
        temporaryPassword,
        loginIsLoading,
        registerWithUserIdentifierIsLoading,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    registerWithUserIdentifier: bindActionCreators(authActions.registerWithUserIdentifier, dispatch),
    loginUser: bindActionCreators(authActions.loginUser, dispatch),
});
type MadeAnAccountScreenNavigationProp = StackNavigationProp<UnauthenticatedStackParamList, Screens.MadeAnAccount>;

type NavigationProps = {
    navigation: MadeAnAccountScreenNavigationProp;
};
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class MadeAnAccountScreenComponent extends PureComponent<Props> {
    componentDidMount() {
        const userIdentifier = uuid.v4();
        this.props.registerWithUserIdentifier({ userIdentifier });
    }

    render(): JSX.Element {
        const { profileImage, username, registerWithUserIdentifierIsLoading, loginIsLoading } = this.props;
        if (registerWithUserIdentifierIsLoading) {
            return <LoadingScreenSpinner />;
        }
        return (
            <View style={styles.container}>
                <Spacer>
                    <Text>{`We've generated this account for you to explore streakoid. No need to register if you don't want to.`}</Text>
                    <Spacer>
                        <View style={{ alignItems: 'center' }}>
                            <Avatar
                                renderPlaceholderContent={<ActivityIndicator />}
                                source={{ uri: profileImage }}
                                size="large"
                                rounded
                            />
                            <Spacer>
                                <Text>{`@${username}`}</Text>
                            </Spacer>
                        </View>
                    </Spacer>
                    <Spacer>
                        <Text>{'You can customize your account later.'}</Text>
                    </Spacer>
                    <Spacer>
                        <Button
                            icon={<FontAwesomeIcon icon={faArrowRight} color="white" />}
                            loading={loginIsLoading}
                            onPress={() => {
                                const { loginUser, username, temporaryPassword } = this.props;
                                loginUser({
                                    emailOrCognitoUsername: username,
                                    password: temporaryPassword,
                                    redirectToHomeOnLogin: false,
                                });
                            }}
                        />
                    </Spacer>
                </Spacer>
            </View>
        );
    }
}

const MadeAnAccountScreen = connect(mapStateToProps, mapDispatchToProps)(MadeAnAccountScreenComponent);

export { MadeAnAccountScreen };
