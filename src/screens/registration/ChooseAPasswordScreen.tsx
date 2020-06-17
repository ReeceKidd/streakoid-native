import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { View, StyleSheet } from 'react-native';
import { authActions } from '../../actions/authActions';
import { ChooseAPasswordForm } from '../../components/ChooseAPasswordForm';
import { Spacer } from '../../components/Spacer';
import { RegistrationProgressBar } from '../../components/RegistrationProgressBar';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    const temporaryPassword =
        state && state.users && state.users.currentUser && state.users.currentUser.temporaryPassword;
    const updatePasswordErrorMessage = state && state.auth && state.auth.updatePasswordErrorMessage;
    return { currentUser, temporaryPassword, updatePasswordErrorMessage };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    updateUserPassword: bindActionCreators(authActions.updateUserPassword, dispatch),
    clearUpdateUserPasswordErrorMessage: bindActionCreators(authActions.clearUpdateUserPasswordErrorMessage, dispatch),
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class ChooseAPasswordScreenComponent extends PureComponent<Props> {
    render(): JSX.Element {
        const { updateUserPassword, currentUser, temporaryPassword } = this.props;
        return (
            <View style={styles.container}>
                <RegistrationProgressBar currentUser={currentUser} />
                <Spacer>
                    <ChooseAPasswordForm updateUserPassword={updateUserPassword} oldPassword={temporaryPassword} />
                </Spacer>
            </View>
        );
    }
}

const ChooseAPasswordScreen = connect(mapStateToProps, mapDispatchToProps)(ChooseAPasswordScreenComponent);

export { ChooseAPasswordScreen };
