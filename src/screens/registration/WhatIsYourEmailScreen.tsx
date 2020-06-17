import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { SafeAreaView, StyleSheet } from 'react-native';
import { authActions } from '../../actions/authActions';
import { Spacer } from '../../components/Spacer';
import { WhatIsYourEmailForm } from '../../components/WhatIsYourEmailForm';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../screenNavigation/RootNavigator';
import { Screens } from '../Screens';
import { RegistrationProgressBar } from '../../components/RegistrationProgressBar';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    const updateUserEmailAttributeErrorMessage = state && state.auth && state.auth.updateEmailAttributeErrorMessage;
    const updateUserEmailAttributeIsLoading = state && state.auth && state.auth.updateEmailAttributeIsLoading;
    return { currentUser, updateUserEmailAttributeErrorMessage, updateUserEmailAttributeIsLoading };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    updateUserEmailAttribute: bindActionCreators(authActions.updateUserEmailAttribute, dispatch),
    clearUpdateUserEmailAttributeErrorMessage: bindActionCreators(
        authActions.clearUpdateUserEmailAttribueErrorMessage,
        dispatch,
    ),
});

type WhatIsYourEmailScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.WhatIsYourEmail>;

type NavigationProps = {
    navigation: WhatIsYourEmailScreenNavigationProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class WhatIsYourEmailScreenComponent extends PureComponent<Props> {
    componentDidMount() {
        this.props.clearUpdateUserEmailAttributeErrorMessage();
    }
    render(): JSX.Element {
        const {
            updateUserEmailAttribute,
            currentUser,
            updateUserEmailAttributeErrorMessage,
            updateUserEmailAttributeIsLoading,
        } = this.props;
        return (
            <SafeAreaView style={styles.container}>
                <Spacer>
                    <RegistrationProgressBar currentUser={currentUser} />
                    <WhatIsYourEmailForm
                        updateUserEmailAttribute={updateUserEmailAttribute}
                        updateUserEmailAttributeErrorMessage={updateUserEmailAttributeErrorMessage}
                        updateUserEmailAttributeIsLoading={updateUserEmailAttributeIsLoading}
                        navigation={this.props.navigation}
                    />
                </Spacer>
            </SafeAreaView>
        );
    }
}

const WhatIsYourEmailScreen = connect(mapStateToProps, mapDispatchToProps)(WhatIsYourEmailScreenComponent);

export { WhatIsYourEmailScreen };
