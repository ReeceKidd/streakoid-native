import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { noteActions } from '../../actions/sharedActions';
import { View, StyleSheet } from 'react-native';
import { Spacer } from '../../components/Spacer';
import { AddNoteForm } from '../../components/AddNoteForm';
import { StreakTypes } from '@streakoid/streakoid-sdk/lib';

const mapStateToProps = (state: AppState) => {
    const selectedChallengeStreak = state && state.challengeStreaks && state.challengeStreaks.selectedChallengeStreak;
    const challengeStreakId = selectedChallengeStreak && selectedChallengeStreak._id;
    const createNoteIsLoading = state && state.notes && state.notes.createNoteIsLoading;
    const createNoteErrorMessage = state && state.notes && state.notes.createNoteErrorMessage;
    return {
        challengeStreakId,
        selectedChallengeStreak,
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

class AddNoteToChallengeStreakScreenComponent extends Component<Props> {
    static navigationOptions = {
        title: 'Add note to challenge streak',
    };

    render(): JSX.Element {
        const { createNote, challengeStreakId, createNoteIsLoading, createNoteErrorMessage } = this.props;
        return (
            <View style={styles.container}>
                <Spacer>
                    <AddNoteForm
                        createNote={createNote}
                        streakId={challengeStreakId}
                        streakType={StreakTypes.challenge}
                        createNoteIsLoading={createNoteIsLoading}
                        createNoteErrorMessage={createNoteErrorMessage}
                        text={''}
                    />
                </Spacer>
            </View>
        );
    }
}

const AddNoteToChallengeStreakScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AddNoteToChallengeStreakScreenComponent);

export { AddNoteToChallengeStreakScreen };
