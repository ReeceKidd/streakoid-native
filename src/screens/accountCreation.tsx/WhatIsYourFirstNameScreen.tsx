import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { View, StyleSheet } from 'react-native';
import { userActions } from '../../actions/authenticatedSharedActions';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens } from '../Screens';
import { Spacer } from '../../components/Spacer';
import { Text } from 'react-native-elements';
import { WhatIsYourFirstNameForm } from '../../components/WhatIsYourFirstNameForm';
import { AccountStackParamList } from '../../screenNavigation/AccountStack';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    return { currentUser };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    updateCurrentUser: bindActionCreators(userActions.updateCurrentUser, dispatch),
});

type WhatIsYourFirstNameScreenProp = StackNavigationProp<AccountStackParamList, Screens.WhatIsYourFirstName>;

type NavigationProps = {
    navigation: WhatIsYourFirstNameScreenProp;
};
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class WhatIsYourFirstNameScreenComponent extends PureComponent<Props> {
    render(): JSX.Element {
        const { updateCurrentUser, currentUser } = this.props;
        return (
            <View style={styles.container}>
                <Spacer>
                    <Text>{'What is your first name?'}</Text>
                    <WhatIsYourFirstNameForm
                        updateCurrentUser={updateCurrentUser}
                        currentFirstName={currentUser.firstName}
                    />
                </Spacer>
            </View>
        );
    }
}

const WhatIsYourFirstNameScreen = connect(mapStateToProps, mapDispatchToProps)(WhatIsYourFirstNameScreenComponent);

export { WhatIsYourFirstNameScreen };
