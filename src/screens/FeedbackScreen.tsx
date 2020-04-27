import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { emailActions } from '../../actions/sharedActions';
import { View, StyleSheet, Text } from 'react-native';
import { Spacer } from '../../components/Spacer';
import { ContactUsForm } from '../../components/ContactUsForm';
import { ErrorMessage } from '../../components/ErrorMessage';
import { HamburgerSelector } from '../../components/HamburgerSelector';
import { NavigationScreenProp, NavigationState } from 'react-navigation';

const mapStateToProps = (state: AppState) => {
    const sendContactUsEmailSuccessMessage = state && state.users && state.users.sendContactUsEmailSuccessMessage;
    const sendContactUsEmailErrorMessage = state && state.users && state.users.sendCancelMembershipEmailErrorMessage;
    const sendContactUsEmailIsLoading = state && state.users && state.users.sendContactUsEmailIsLoading;
    return { sendContactUsEmailSuccessMessage, sendContactUsEmailErrorMessage, sendContactUsEmailIsLoading };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    sendContactUsEmail: bindActionCreators(emailActions.sendContactUsEmail, dispatch),
    clearSendContactUsEmailMessages: bindActionCreators(emailActions.clearSendContactUsEmailMessages, dispatch),
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class FeedbackScreenComponent extends Component<Props> {
    static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationState, {}> }) => {
        return {
            title: 'Feedback',
            headerLeft: () => <HamburgerSelector navigation={navigation} />,
        };
    };

    componentDidMount(): void {
        this.props.clearSendContactUsEmailMessages();
    }

    render(): JSX.Element {
        const {
            sendContactUsEmail,
            sendContactUsEmailIsLoading,
            sendContactUsEmailErrorMessage,
            sendContactUsEmailSuccessMessage,
        } = this.props;
        return (
            <View style={styles.container}>
                <Spacer>
                    <ContactUsForm
                        sendContactUsEmail={sendContactUsEmail}
                        sendContactUsEmailIsLoading={sendContactUsEmailIsLoading}
                        name=""
                        email=""
                        message=""
                    />
                </Spacer>
                {sendContactUsEmailErrorMessage ? (
                    <Spacer>
                        <ErrorMessage message={sendContactUsEmailErrorMessage} />
                    </Spacer>
                ) : null}
                {sendContactUsEmailSuccessMessage ? (
                    <Spacer>
                        <Text style={{ color: 'green' }}>{sendContactUsEmailSuccessMessage}</Text>
                    </Spacer>
                ) : null}
            </View>
        );
    }
}

const FeedbackScreen = connect(mapStateToProps, mapDispatchToProps)(FeedbackScreenComponent);

export { FeedbackScreen };
