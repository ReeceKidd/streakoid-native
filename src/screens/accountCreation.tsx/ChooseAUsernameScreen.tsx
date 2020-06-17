import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { SafeAreaView, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens } from '../Screens';
import { Spacer } from '../../components/Spacer';
import { ChooseAUsernameForm } from '../../components/ChooseAUsernameForm';
import { RootStackParamList } from '../../screenNavigation/RootNavigator';
import { authActions } from '../../actions/authActions';
import { AccountStrengthProgressBar } from '../../components/AccountStrengthProgressBar';

const mapStateToProps = (state: AppState) => {
    const updateUsernameAttributeErrorMessage = state && state.auth && state.auth.updateUsernameAttributeErrorMessage;
    const updateUsernameAttributeIsLoading = state && state.auth && state.auth.updateUsernameAttributeIsLoading;
    const currentUser = state && state.users && state.users.currentUser && state.users.currentUser;
    return { updateUsernameAttributeErrorMessage, updateUsernameAttributeIsLoading, currentUser };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    updateUsernameAttribute: bindActionCreators(authActions.updateUsernameAttribute, dispatch),
    clearUpdateUsernameAttributeErrorMessage: bindActionCreators(
        authActions.clearUpdateUsernameAttributeErrorMessage,
        dispatch,
    ),
});

type ChooseAUsernameScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.ChooseAUsername>;

type NavigationProps = {
    navigation: ChooseAUsernameScreenNavigationProp;
};
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class ChooseAUsernameScreenComponent extends PureComponent<Props> {
    componentDidMount() {
        this.props.clearUpdateUsernameAttributeErrorMessage();
    }
    render(): JSX.Element {
        const {
            updateUsernameAttribute,
            updateUsernameAttributeIsLoading,
            updateUsernameAttributeErrorMessage,
            currentUser,
        } = this.props;
        return (
            <SafeAreaView style={styles.container}>
                <AccountStrengthProgressBar currentUser={currentUser} />
                <Spacer>
                    <ChooseAUsernameForm
                        updateUsernameAttribute={updateUsernameAttribute}
                        updateUsernameAttributeIsLoading={updateUsernameAttributeIsLoading}
                        updateUsernameAttributeErrorMessage={updateUsernameAttributeErrorMessage}
                        currentUsername={currentUser.username}
                    />
                </Spacer>
            </SafeAreaView>
        );
    }
}

const ChooseAUsernameScreen = connect(mapStateToProps, mapDispatchToProps)(ChooseAUsernameScreenComponent);

export { ChooseAUsernameScreen };
