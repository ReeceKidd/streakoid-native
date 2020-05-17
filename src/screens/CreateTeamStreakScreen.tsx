import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { teamStreakActions, userActions } from '../actions/sharedActions';
import { View, StyleSheet } from 'react-native';
import { Spacer } from '../components/Spacer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { CreateTeamStreakForm } from '../components/CreateTeamStreakForm';
import { NavigationScreenProp, NavigationState, NavigationParams, ScrollView } from 'react-navigation';

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
    createTeamStreak: bindActionCreators(teamStreakActions.createTeamStreak, dispatch),
    clearCreateTeamStreakError: bindActionCreators(teamStreakActions.clearCreateTeamStreakError, dispatch),
    addFollowerToTeamStreak: bindActionCreators(teamStreakActions.addFollowerToTeamStreak, dispatch),
    selectFollower: bindActionCreators(userActions.selectFollower, dispatch),
    unselectFollower: bindActionCreators(userActions.unselectFollower, dispatch),
});

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class CreateTeamStreakScreenComponent extends PureComponent<Props> {
    static navigationOptions = {
        title: 'Create team streak',
        tabBarIcon: <FontAwesomeIcon icon={faPlus} />,
    };

    render(): JSX.Element {
        const {
            createTeamStreak,
            selectFollower,
            unselectFollower,
            createTeamStreakIsLoading,
            createTeamStreakErrorMessage,
            currentUser,
        } = this.props;
        const members: { memberId: string }[] = [];
        currentUser.followers.forEach((follower) => {
            if (follower.isSelected) {
                members.push({ memberId: follower.userId });
            }
        });
        return (
            <ScrollView style={styles.container}>
                <View>
                    <Spacer>
                        <CreateTeamStreakForm
                            createTeamStreak={createTeamStreak}
                            selectFollower={selectFollower}
                            unselectFollower={unselectFollower}
                            followers={currentUser.followers}
                            members={members}
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
