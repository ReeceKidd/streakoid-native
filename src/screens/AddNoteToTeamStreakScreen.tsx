import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { noteActions } from '../actions/authenticatedSharedActions';
import { View, StyleSheet } from 'react-native';
import { Spacer } from '../components/Spacer';
import { AddNoteForm } from '../components/AddNoteForm';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

const mapStateToProps = (state: AppState) => {
    const selectedTeamStreak = state && state.teamStreaks && state.teamStreaks.selectedTeamStreak;
    const teamStreakId = selectedTeamStreak && selectedTeamStreak._id;
    const createNoteIsLoading = state && state.notes && state.notes.createNoteIsLoading;
    const createNoteErrorMessage = state && state.notes && state.notes.createNoteErrorMessage;
    return {
        teamStreakId,
        selectedTeamStreak,
        createNoteIsLoading,
        createNoteErrorMessage,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    createNote: bindActionCreators(noteActions.createNote, dispatch),
});
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class AddNoteToTeamStreakScreenComponent extends PureComponent<Props> {
    static navigationOptions = {
        title: 'Add note to team streak',
    };

    render(): JSX.Element {
        const { createNote, teamStreakId, createNoteIsLoading, createNoteErrorMessage } = this.props;
        return (
            <View style={styles.container}>
                <Spacer>
                    <AddNoteForm
                        createNote={createNote}
                        streakId={teamStreakId}
                        streakType={StreakTypes.team}
                        createNoteIsLoading={createNoteIsLoading}
                        createNoteErrorMessage={createNoteErrorMessage}
                        text={''}
                    />
                </Spacer>
            </View>
        );
    }
}

const AddNoteToTeamStreakScreen = connect(mapStateToProps, mapDispatchToProps)(AddNoteToTeamStreakScreenComponent);

export { AddNoteToTeamStreakScreen };
