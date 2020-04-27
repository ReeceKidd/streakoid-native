import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { View, StyleSheet } from 'react-native';

import { Spacer } from '../../components/Spacer';
import { teamStreakActions } from '../../actions/sharedActions';
import { EditTeamStreakForm } from '../../components/EditTeamStreakForm';

const mapStateToProps = (state: AppState) => {
    const selectedTeamStreak = state && state.teamStreaks && state.teamStreaks.selectedTeamStreak;
    const editTeamStreakIsLoading = state && state.teamStreaks && state.teamStreaks.editTeamStreakIsLoading;
    const editTeamStreakErrorMessage = state && state.teamStreaks && state.teamStreaks.editTeamStreakErrorMessage;
    const { _id, streakName, streakDescription, numberOfMinutes } = selectedTeamStreak;
    return {
        teamStreakId: _id,
        streakName,
        editTeamStreakIsLoading,
        editTeamStreakErrorMessage,
        streakDescription,
        numberOfMinutes,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    editTeamStreak: bindActionCreators(teamStreakActions.editTeamStreak, dispatch),
    clearEditTeamStreakErrorMessage: bindActionCreators(teamStreakActions.clearEditTeamStreakErrorMessage, dispatch),
});
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class EditTeamStreakScreenComponent extends Component<Props> {
    static navigationOptions = {
        title: 'Edit team streak',
    };

    clearMessages = (): void => {
        this.props.clearEditTeamStreakErrorMessage();
    };

    render(): JSX.Element {
        const {
            editTeamStreak,
            teamStreakId,
            streakName,
            streakDescription,
            numberOfMinutes,
            editTeamStreakIsLoading,
            editTeamStreakErrorMessage,
        } = this.props;
        return (
            <View style={styles.container}>
                <Spacer>
                    <EditTeamStreakForm
                        editTeamStreak={editTeamStreak}
                        clearMessages={this.clearMessages}
                        teamStreakId={teamStreakId}
                        streakName={streakName}
                        editTeamStreakIsLoading={editTeamStreakIsLoading}
                        editTeamStreakErrorMessage={editTeamStreakErrorMessage}
                        streakDescription={streakDescription}
                        numberOfMinutes={numberOfMinutes}
                    />
                </Spacer>
            </View>
        );
    }
}

const EditTeamStreakScreen = connect(mapStateToProps, mapDispatchToProps)(EditTeamStreakScreenComponent);

export { EditTeamStreakScreen };
