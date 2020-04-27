import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { NavigationScreenProp, NavigationState, NavigationParams, NavigationEvents } from 'react-navigation';
import { View, StyleSheet } from 'react-native';

import { AppState } from '../../store';
import { LoginForm } from '../components/LoginForm';
import { Text } from 'react-native-elements';
import { Spacer } from '../components/Spacer';
import { Screens } from './Screens';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { authActions } from '../actions/sharedActions';
import { NavigationLink } from '../components/NavigationLink';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const mapStateToProps = (state: AppState) => {
    const loginErrorMessage = state && state.auth && state.auth.loginErrorMessage;
    const updatePasswordSuccessMessage = state && state.auth && state.auth.updatePasswordSuccessMessage;
    const loginIsLoading = state.auth && state.auth && state.auth.loginIsLoading;
    const { currentUser } = state.users;
    return { loginErrorMessage, loginIsLoading, currentUser, updatePasswordSuccessMessage };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    loginUser: bindActionCreators(authActions.loginUser, dispatch),
    clearLoginErrorMessage: bindActionCreators(authActions.clearLoginErrorMessage, dispatch),
    clearUpdatePasswordSuccessMessage: bindActionCreators(authActions.clearUpdatePasswordSuccessMessage, dispatch),
});

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 20,
    },
});

class LoginScreenComponent extends React.Component<Props> {
    static navigationOptions = {
        title: 'Login',
        header: null,
        tabBarIcon: <FontAwesomeIcon icon={faPlus} size={20} />,
    };

    clearMessages() {
        this.props.clearLoginErrorMessage();
        this.props.clearUpdatePasswordSuccessMessage();
    }

    componentDidMount(): void {
        this.props.clearLoginErrorMessage();
    }

    render(): JSX.Element {
        const {
            loginUser,
            clearLoginErrorMessage,
            clearUpdatePasswordSuccessMessage,
            loginErrorMessage,
            loginIsLoading,
            updatePasswordSuccessMessage,
        } = this.props;
        return (
            <View style={styles.container}>
                <NavigationEvents onWillBlur={() => this.clearMessages()} />
                <Spacer />
                {updatePasswordSuccessMessage ? (
                    <Text style={{ color: 'green', textAlign: 'center' }}> {updatePasswordSuccessMessage} </Text>
                ) : null}
                <Spacer>
                    <Text h3> Log in </Text>
                </Spacer>
                <LoginForm
                    loginUser={loginUser}
                    clearLoginErrorMessage={clearLoginErrorMessage}
                    clearUpdatePasswordSuccessMessage={clearUpdatePasswordSuccessMessage}
                    loginIsLoading={loginIsLoading}
                />
                <Spacer />
                {loginErrorMessage ? (
                    <Text style={{ color: 'red', textAlign: 'center' }}> {loginErrorMessage} </Text>
                ) : null}
                <Spacer>
                    <NavigationLink
                        navigation={this.props.navigation}
                        text="Forgot password"
                        screen={Screens.ForgotPassword}
                    />
                </Spacer>
            </View>
        );
    }
}

const LoginScreen = connect(mapStateToProps, mapDispatchToProps)(LoginScreenComponent);

export { LoginScreen };
