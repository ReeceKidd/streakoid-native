import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { View, StyleSheet } from 'react-native';
import { noteActions } from '../../actions/authenticatedSharedActions';
import { Spacer } from '../../components/Spacer';
import { Text, Button } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../screenNavigation/RootNavigator';
import { Screens } from '../Screens';
import { AccountStrengthProgressBar } from '../../components/AccountStrengthProgressBar';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    return {
        currentUser,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    createNote: bindActionCreators(noteActions.createNote, dispatch),
});

type CompletedCustomizationScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    Screens.CompletedCustomization
>;

type NavigationProps = {
    navigation: CompletedCustomizationScreenNavigationProp;
};
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class CompletedCustomizationScreenComponent extends PureComponent<Props> {
    render(): JSX.Element {
        const { currentUser } = this.props;
        return (
            <View style={styles.container}>
                <AccountStrengthProgressBar currentUser={currentUser} />
                <Spacer>
                    <Text>{`Well done! Your account is now customized.`}</Text>
                    <Spacer>
                        <Button title="Finish" onPress={() => this.props.navigation.popToTop()} />
                    </Spacer>
                </Spacer>
            </View>
        );
    }
}

const CompletedCustomizationScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(CompletedCustomizationScreenComponent);

export { CompletedCustomizationScreen };
