import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { SafeAreaView, StyleSheet } from 'react-native';
import { authActions } from '../../actions/authActions';
import { VerifyEmailForm } from '../../components/VerifyEmailForm';
import { Spacer } from '../../components/Spacer';
import { Text } from 'react-native-elements';
import { RegistrationProgressBar } from '../../components/RegistrationProgressBar';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    const email = state && state.users && state.users.currentUser && state.users.currentUser.email;
    const verifyEmailErrorMessage = state && state.auth && state.auth.verifyEmailErrorMessage;
    const verifyEmailIsLoading = state && state.auth && state.auth.verifyEmailIsLoading;
    return { currentUser, email, verifyEmailErrorMessage, verifyEmailIsLoading };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    verifyEmail: bindActionCreators(authActions.verifyEmail, dispatch),
    clearVerifyEmailErrorMessage: bindActionCreators(authActions.clearVerifyUserErrorMessage, dispatch),
});
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class VerifyEmailScreenComponent extends PureComponent<Props> {
    componentDidMount() {
        this.props.clearVerifyEmailErrorMessage();
    }
    render(): JSX.Element {
        const { verifyEmail, email, currentUser, verifyEmailErrorMessage, verifyEmailIsLoading } = this.props;
        return (
            <SafeAreaView style={styles.container}>
                <Spacer>
                    <RegistrationProgressBar currentUser={currentUser} />
                    <Text
                        style={{ fontWeight: 'bold', marginLeft: 15 }}
                    >{`Enter the verification code we sent to: ${email}`}</Text>
                    <VerifyEmailForm
                        verifyEmail={verifyEmail}
                        verifyEmailErrorMessage={verifyEmailErrorMessage}
                        verifyEmailIsLoading={verifyEmailIsLoading}
                    />
                </Spacer>
            </SafeAreaView>
        );
    }
}

const VerifyEmailScreen = connect(mapStateToProps, mapDispatchToProps)(VerifyEmailScreenComponent);

export { VerifyEmailScreen };
