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
    const selectedSoloStreak = state && state.soloStreaks && state.soloStreaks.selectedSoloStreak;
    const soloStreakId = selectedSoloStreak && selectedSoloStreak._id;
    const createNoteIsLoading = state && state.notes && state.notes.createNoteIsLoading;
    const createNoteErrorMessage = state && state.notes && state.notes.createNoteErrorMessage;
    return {
        soloStreakId,
        selectedSoloStreak,
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

class AddNoteToSoloStreakScreenComponent extends PureComponent<Props> {
    static navigationOptions = {
        title: 'Add note to solo streak',
    };

    render(): JSX.Element {
        const { createNote, soloStreakId, createNoteIsLoading, createNoteErrorMessage } = this.props;
        return (
            <View style={styles.container}>
                <Spacer>
                    <AddNoteForm
                        createNote={createNote}
                        streakId={soloStreakId}
                        streakType={StreakTypes.solo}
                        createNoteIsLoading={createNoteIsLoading}
                        createNoteErrorMessage={createNoteErrorMessage}
                        text={''}
                    />
                </Spacer>
            </View>
        );
    }
}

const AddNoteToSoloStreakScreen = connect(mapStateToProps, mapDispatchToProps)(AddNoteToSoloStreakScreenComponent);

export { AddNoteToSoloStreakScreen };
