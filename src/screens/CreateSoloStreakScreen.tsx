import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { CreateSoloStreakForm } from '../components/CreateSoloStreakForm';

import { soloStreakActions } from '../actions/authenticatedSharedActions';
import { View, StyleSheet } from 'react-native';
import { Spacer } from '../components/Spacer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { Screens } from './Screens';

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
});

type CreateSoloStreakScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.CreateSoloStreak>;

type NavigationProps = {
    navigation: CreateSoloStreakScreenNavigationProp;
};
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class CreateSoloStreakScreenComponent extends PureComponent<Props> {
    static navigationOptions = {
        title: 'Create solo streak',
        tabBarIcon: <FontAwesomeIcon icon={faPlus} />,
    };

    render(): JSX.Element {
        const { createSoloStreak, createSoloStreakIsLoading, createSoloStreakErrorMessage } = this.props;
        return (
            <View style={styles.container}>
                <Spacer>
                    <CreateSoloStreakForm
                        createSoloStreak={createSoloStreak}
                        createSoloStreakIsLoading={createSoloStreakIsLoading}
                        createSoloStreakErrorMessage={createSoloStreakErrorMessage}
                        navigation={this.props.navigation}
                    />
                </Spacer>
            </View>
        );
    }
}

const CreateSoloStreakScreen = connect(mapStateToProps, mapDispatchToProps)(CreateSoloStreakScreenComponent);

export { CreateSoloStreakScreen };
