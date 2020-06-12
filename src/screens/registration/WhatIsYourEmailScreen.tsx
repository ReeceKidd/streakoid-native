import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { View, StyleSheet } from 'react-native';
import { noteActions } from '../../actions/authenticatedSharedActions';

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

class WhatIsYourEmailScreenComponent extends PureComponent<Props> {
    render(): JSX.Element {
        return <View style={styles.container}></View>;
    }
}

const WhatIsYourEmailScreen = connect(mapStateToProps, mapDispatchToProps)(WhatIsYourEmailScreenComponent);

export { WhatIsYourEmailScreen };
