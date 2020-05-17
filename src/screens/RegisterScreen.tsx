import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { AppState } from '../../store';
import { bindActionCreators } from 'redux';
import { RegisterForm } from '../components/RegisterForm';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { Spacer } from '../components/Spacer';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { authActions } from '../actions/sharedActions';

const mapStateToProps = (state: AppState) => {
    const registerErrorMessage = state && state.auth && state.auth.registerErrorMessage;
    const registerIsLoading = state && state.auth && state.auth.registerIsLoading;
    return { registerErrorMessage, registerIsLoading };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    registerUser: bindActionCreators(authActions.registerUser, dispatch),
    clearRegisterErrorMessage: bindActionCreators(authActions.clearRegisterErrorMessage, dispatch),
});

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

class RegisterScreenComponent extends React.PureComponent<Props> {
    static navigationOptions = {
        header: null,
    };

    render(): JSX.Element {
        const { registerUser, clearRegisterErrorMessage, registerErrorMessage, registerIsLoading } = this.props;
        return (
            <View style={styles.container}>
                <Spacer />
                <Spacer>
                    <Text h3> Register </Text>
                </Spacer>
                <RegisterForm
                    registerUser={registerUser}
                    clearRegisterErrorMessage={clearRegisterErrorMessage}
                    registerIsLoading={registerIsLoading}
                />
                <Spacer />
                {registerErrorMessage ? (
                    <Text style={{ color: 'red', textAlign: 'center' }}> {registerErrorMessage} </Text>
                ) : null}
            </View>
        );
    }
}

const RegisterScreen = connect(mapStateToProps, mapDispatchToProps)(RegisterScreenComponent);

export { RegisterScreen };
