import React from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../store';
import { bindActionCreators, Dispatch } from 'redux';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { Spacer } from '../components/Spacer';
import { authActions } from '../actions/authActions';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../StackNavigator';
import { Screens } from './Screens';

const mapStateToProps = (state: AppState) => {
    const forgotPasswordErrorMessage = state && state.auth && state.auth.forgotPasswordErrorMessage;
    const forgotPasswordIsLoading = state && state.auth && state.auth.forgotPasswordIsLoading;
    const { currentUser } = state.users;
    return { forgotPasswordErrorMessage, forgotPasswordIsLoading, currentUser };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    forgotPassword: bindActionCreators(authActions.forgotPassword, dispatch),
    clearForgotPasswordErrorMessage: bindActionCreators(authActions.clearForgotPasswordErrorMessage, dispatch),
});

type ForgotPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.ForgotPassword>;
type ForgotPasswordScreenRouteProp = RouteProp<RootStackParamList, Screens.ForgotPassword>;

type NavigationProps = {
    navigation: ForgotPasswordScreenNavigationProp;
    route: ForgotPasswordScreenRouteProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 20,
    },
    link: {
        color: 'blue',
    },
});

class ForgotPasswordScreenComponent extends React.PureComponent<Props> {
    static navigationOptions = {
        header: null,
    };

    componentDidMount(): void {
        this.props.clearForgotPasswordErrorMessage();
    }

    render(): JSX.Element {
        const { forgotPassword, forgotPasswordErrorMessage, forgotPasswordIsLoading } = this.props;
        return (
            <View style={styles.container}>
                <Spacer />
                <Spacer>
                    <Text h3 style={{ textAlign: 'center' }}>
                        Forgot Password
                    </Text>
                    <Text style={{ textAlign: 'center' }}> Please enter your email or username </Text>
                </Spacer>
                <ForgotPasswordForm forgotPassword={forgotPassword} forgotPasswordIsLoading={forgotPasswordIsLoading} />
                <Spacer />
                {forgotPasswordErrorMessage ? (
                    <Text style={{ color: 'red', textAlign: 'center' }}> {forgotPasswordErrorMessage} </Text>
                ) : null}
            </View>
        );
    }
}

const ForgotPasswordScreen = connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordScreenComponent);

export { ForgotPasswordScreen };
