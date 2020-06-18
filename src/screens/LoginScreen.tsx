import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { StyleSheet, SafeAreaView } from 'react-native';

import { AppState } from '../../store';
import { LoginForm } from '../components/LoginForm';
import { Text } from 'react-native-elements';
import { Spacer } from '../components/Spacer';
import { Screens } from './Screens';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { authActions } from '../actions/authActions';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { UnauthenticatedStackParamList } from '../screenNavigation/UnauthenticatedStack';
import { TouchableOpacity } from 'react-native-gesture-handler';

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

type LoginScreenNavigationProp = StackNavigationProp<UnauthenticatedStackParamList, Screens.Login>;
type LoginScreenRouteProp = RouteProp<UnauthenticatedStackParamList, Screens.Login>;

type NavigationProps = {
    navigation: LoginScreenNavigationProp;
    route: LoginScreenRouteProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
            <SafeAreaView style={styles.container}>
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
                    <TouchableOpacity onPress={() => this.props.navigation.navigate(Screens.ForgotPassword)}>
                        <Text style={{ color: 'blue' }}>{`Forgot password`}</Text>
                    </TouchableOpacity>
                </Spacer>
            </SafeAreaView>
        );
    }
}

const LoginScreen = connect(mapStateToProps, mapDispatchToProps)(LoginScreenComponent);

export { LoginScreen };
