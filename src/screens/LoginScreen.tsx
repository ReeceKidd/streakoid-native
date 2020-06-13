import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { View, StyleSheet } from 'react-native';

import { AppState } from '../../store';
import { LoginForm } from '../components/LoginForm';
import { Text } from 'react-native-elements';
import { Spacer } from '../components/Spacer';
import { Screens } from './Screens';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { authActions } from '../actions/authActions';
import { NavigationLink } from '../components/NavigationLink';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';

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

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.Login>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, Screens.Login>;

type NavigationProps = {
    navigation: LoginScreenNavigationProp;
    route: LoginScreenRouteProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 20,
    },
});

class LoginScreenComponent extends React.PureComponent<Props> {
    static navigationOptions = {
        title: 'Login',
        header: null,
        tabBarIcon: <FontAwesomeIcon icon={faPlus} />,
    };

    clearMessages() {
        this.props.clearLoginErrorMessage();
        this.props.clearUpdatePasswordSuccessMessage();
    }

    componentDidMount(): void {
        this.props.clearLoginErrorMessage();
    }

    componentWillUnmount(): void {
        this.clearMessages();
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
                        text="Forgot password"
                        screen={Screens.ForgotPassword}
                        navigation={this.props.navigation}
                    />
                </Spacer>
            </View>
        );
    }
}

const LoginScreen = connect(mapStateToProps, mapDispatchToProps)(LoginScreenComponent);

export { LoginScreen };
