import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { StyleSheet, SafeAreaView } from 'react-native';
import { userActions } from '../../actions/authenticatedSharedActions';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens } from '../Screens';
import { Spacer } from '../../components/Spacer';
import { WhatIsYourLastNameForm } from '../../components/WhatIsYourLastNameForm';
import { RootStackParamList } from '../../screenNavigation/RootNavigator';
import { AccountStrengthProgressBar } from '../../components/AccountStrengthProgressBar';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    return { currentUser };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    updateCurrentUser: bindActionCreators(userActions.updateCurrentUser, dispatch),
});

type WhatIsYourLastNameScreenProp = StackNavigationProp<RootStackParamList, Screens.WhatIsYourLastName>;

type NavigationProps = {
    navigation: WhatIsYourLastNameScreenProp;
};
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class WhatIsYourLastNameScreenComponent extends PureComponent<Props> {
    render(): JSX.Element {
        const { updateCurrentUser, currentUser } = this.props;
        return (
            <SafeAreaView style={styles.container}>
                <AccountStrengthProgressBar currentUser={currentUser} />
                <Spacer>
                    <WhatIsYourLastNameForm
                        updateCurrentUser={updateCurrentUser}
                        currentLastName={currentUser.lastName}
                        navigation={this.props.navigation}
                    />
                </Spacer>
            </SafeAreaView>
        );
    }
}

const WhatIsYourLastNameScreen = connect(mapStateToProps, mapDispatchToProps)(WhatIsYourLastNameScreenComponent);

export { WhatIsYourLastNameScreen };
