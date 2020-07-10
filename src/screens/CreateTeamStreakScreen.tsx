import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { teamStreakActions, userActions } from '../actions/authenticatedSharedActions';
import { View, StyleSheet } from 'react-native';
import { Spacer } from '../components/Spacer';
import { CreateTeamStreakForm } from '../components/CreateTeamStreakForm';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { Screens } from './Screens';
import { ScrollView } from 'react-native-gesture-handler';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    const createTeamStreakIsLoading = state && state.teamStreaks && state.teamStreaks.createTeamStreakIsLoading;
    const createTeamStreakErrorMessage = state && state.teamStreaks && state.teamStreaks.createTeamStreakErrorMessage;
    return {
        currentUser,
        createTeamStreakIsLoading,
        createTeamStreakErrorMessage,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getCurrentUser: bindActionCreators(userActions.getCurrentUser, dispatch),
    createTeamStreak: bindActionCreators(teamStreakActions.createTeamStreak, dispatch),
    clearCreateTeamStreakError: bindActionCreators(teamStreakActions.clearCreateTeamStreakError, dispatch),
    addUserToTeamStreak: bindActionCreators(teamStreakActions.addUserToTeamStreak, dispatch),
});

type CreateTeamStreakScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.CreateTeamStreak>;
type CreateTeamStreakScreenRouteProp = RouteProp<RootStackParamList, Screens.CreateTeamStreak>;

type NavigationProps = {
    navigation: CreateTeamStreakScreenNavigationProp;
    route: CreateTeamStreakScreenRouteProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class CreateTeamStreakScreenComponent extends PureComponent<Props> {
    componentDidMount() {
        this.props.getCurrentUser();
    }
    render(): JSX.Element {
        const { createTeamStreak, createTeamStreakIsLoading, createTeamStreakErrorMessage } = this.props;

        return (
            <ScrollView style={styles.container}>
                <View>
                    <Spacer>
                        <CreateTeamStreakForm
                            createTeamStreak={createTeamStreak}
                            createTeamStreakIsLoading={createTeamStreakIsLoading}
                            createTeamStreakErrorMessage={createTeamStreakErrorMessage}
                            navigation={this.props.navigation}
                        />
                    </Spacer>
                </View>
            </ScrollView>
        );
    }
}

const CreateTeamStreakScreen = connect(mapStateToProps, mapDispatchToProps)(CreateTeamStreakScreenComponent);

export { CreateTeamStreakScreen };
