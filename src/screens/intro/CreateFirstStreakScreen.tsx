import React from 'react';
import { connect } from 'react-redux';

import { AppActions, AppState } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-elements';
import NavigationService from '../NavigationService';
import { Screens } from '../Screens';
import { soloStreakActions, userActions } from '../../actions/sharedActions';
import { Spacer } from '../../components/Spacer';

const mapStateToProps = (state: AppState) => {
    const createSoloStreakIsLoading = state && state.soloStreaks && state.soloStreaks.createSoloStreakIsLoading;
    const createSoloStreakErrorMessage = state && state.soloStreaks && state.soloStreaks.createSoloStreakErrorMessage;
    return {
        createSoloStreakIsLoading,
        createSoloStreakErrorMessage,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    createSoloStreak: bindActionCreators(soloStreakActions.createSoloStreak, dispatch),
    updateCurrentUser: bindActionCreators(userActions.updateCurrentUser, dispatch),
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class CreateFirstStreakScreenComponent extends React.PureComponent<Props> {
    static navigationOptions = {
        header: null,
    };

    createFirstStreak = () => {
        this.props.updateCurrentUser({ hasCompletedIntroduction: true });
        NavigationService.navigate(Screens.CreateSoloStreak);
    };

    render(): JSX.Element {
        return (
            <View style={styles.container}>
                <Spacer />
                <Spacer>
                    <Text h2 style={{ textAlign: 'center' }}>
                        Create your first streak
                    </Text>
                    <Text h4 style={{ textAlign: 'center' }}>
                        {`Good luck. Remember, Oid's watching...`}
                    </Text>
                </Spacer>
                <Spacer>
                    <Spacer>
                        <Button title="Next" onPress={this.createFirstStreak} />
                    </Spacer>
                </Spacer>
            </View>
        );
    }
}

const CreateFirstStreakScreen = connect(mapStateToProps, mapDispatchToProps)(CreateFirstStreakScreenComponent);

export { CreateFirstStreakScreen };
