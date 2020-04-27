import React from 'react';
import { connect } from 'react-redux';

import { bindActionCreators, Dispatch } from 'redux';
import { View, StyleSheet } from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { Text, Button } from 'react-native-elements';

import { Spacer } from '../../components/Spacer';
import { authActions } from '../../actions/sharedActions';
import { AppState } from '../../store';
import NavigationService from './NavigationService';
import { Screens } from './Screens';

const mapStateToProps = (state: AppState) => {
    const email = state && state.users && state.users.currentUser && state.users.currentUser.email;
    const isAuthenticated = state && state.auth && state.auth.isAuthenticated;
    const resendCodeSuccessMessage = state && state.auth && state.auth.resendCodeSuccessMessage;
    const resendCodeErrorMessage = state && state.auth && state.auth.resendCodeErrorMessage;
    return {
        isAuthenticated,
        email,
        resendCodeSuccessMessage,
        resendCodeErrorMessage,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    resendCode: bindActionCreators(authActions.resendCode, dispatch),
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

class VerifyUserScreenComponent extends React.Component<Props> {
    static navigationOptions = {
        header: null,
    };

    render(): JSX.Element {
        const { resendCodeSuccessMessage, resendCodeErrorMessage, email } = this.props;
        return (
            <View style={styles.container}>
                <Spacer>
                    <Text h3 style={{ textAlign: 'center' }}>
                        Two step verification
                    </Text>
                </Spacer>
                <Spacer>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        {`Click the verification link that was sent to: ${email.toString()}`}{' '}
                    </Text>
                </Spacer>
                <Spacer>
                    <Text style={{ textAlign: 'center' }}>{`After verifying click the login button below.`}</Text>
                </Spacer>
                <Spacer>
                    <Button title="Login" onPress={() => NavigationService.navigate(Screens.Login)} />
                    {resendCodeSuccessMessage ? <Text h2>{resendCodeSuccessMessage}</Text> : null}
                    {resendCodeErrorMessage ? <Text h2>{resendCodeErrorMessage}</Text> : null}
                </Spacer>
            </View>
        );
    }
}

const VerifyUserScreen = connect(mapStateToProps, mapDispatchToProps)(VerifyUserScreenComponent);

export { VerifyUserScreen };
