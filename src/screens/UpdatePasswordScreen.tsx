import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { AppActions } from '@streakoid/streakoid-shared/lib';

import { AppState } from '../../store';
import { UpdatePasswordForm } from '../../components/UpdatePasswordForm';
import { Spacer } from '../../components/Spacer';
import { authActions } from '../../actions/sharedActions';

const mapStateToProps = (state: AppState) => {
    const username = state && state.auth && state.auth.username;
    const forgotPasswordEmailDestination = state && state.auth && state.auth.forgotPasswordEmailDestination;
    const updatePasswordErrorMessage = state && state.auth && state.auth.updatePasswordErrorMessage;
    const updatePasswordSuccessMessage = state && state.auth && state.auth.updatePasswordSuccessMessage;
    const updatePasswordIsLoading = state && state.auth && state.auth.updatePasswordIsLoading;
    return {
        username,
        forgotPasswordEmailDestination,
        updatePasswordErrorMessage,
        updatePasswordIsLoading,
        updatePasswordSuccessMessage,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    updatePassword: bindActionCreators(authActions.updatePassword, dispatch),
    clearUpdatePasswordErrorMessage: bindActionCreators(authActions.clearUpdatePasswordErrorMessage, dispatch),
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 20,
    },
});

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

class UpdatePasswordPageComponent extends Component<Props> {
    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        this.props.clearUpdatePasswordErrorMessage();
    }

    render(): JSX.Element {
        const {
            username,
            forgotPasswordEmailDestination,
            updatePassword,
            updatePasswordIsLoading,
            updatePasswordErrorMessage,
        } = this.props;
        return (
            <View style={styles.container}>
                <Spacer>
                    <Text h2 style={{ textAlign: 'center' }}>
                        {' '}
                        Update your password{' '}
                    </Text>
                    <Text style={{ textAlign: 'center' }}>
                        Enter the code that was emailed to {forgotPasswordEmailDestination} and input a new password
                    </Text>
                </Spacer>
                <UpdatePasswordForm
                    username={username}
                    updatePassword={updatePassword}
                    updatePasswordIsLoading={updatePasswordIsLoading}
                />
                {updatePasswordIsLoading ? (
                    <Text style={{ color: 'red', textAlign: 'center' }}> {updatePasswordErrorMessage} </Text>
                ) : null}
            </View>
        );
    }
}

const UpdatePasswordScreen = connect(mapStateToProps, mapDispatchToProps)(UpdatePasswordPageComponent);
export { UpdatePasswordScreen };
