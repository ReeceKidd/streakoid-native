import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { EditSoloStreakForm } from '../../components/EditSoloStreakForm';

import { soloStreakActions } from '../../actions/sharedActions';
import { View, StyleSheet } from 'react-native';
import { Spacer } from '../../components/Spacer';

const mapStateToProps = (state: AppState) => {
    const selectedSoloStreak = state && state.soloStreaks && state.soloStreaks.selectedSoloStreak;
    const editSoloStreakIsLoading = state && state.soloStreaks && state.soloStreaks.editSoloStreakIsLoading;
    const editSoloStreakErrorMessage = state && state.soloStreaks && state.soloStreaks.editSoloStreakErrorMessage;
    const { _id, streakName, streakDescription, numberOfMinutes } = selectedSoloStreak;
    return {
        soloStreakId: _id,
        streakName,
        editSoloStreakIsLoading,
        editSoloStreakErrorMessage,
        streakDescription,
        numberOfMinutes,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    editSoloStreak: bindActionCreators(soloStreakActions.editSoloStreak, dispatch),
    clearEditSoloStreakErrorMessage: bindActionCreators(soloStreakActions.clearEditSoloStreakErrorMessage, dispatch),
});
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class EditSoloStreakScreenComponent extends Component<Props> {
    static navigationOptions = {
        title: 'Edit solo streak',
    };

    clearMessages = (): void => {
        this.props.clearEditSoloStreakErrorMessage();
    };

    render(): JSX.Element {
        const {
            editSoloStreak,
            soloStreakId,
            streakName,
            streakDescription,
            numberOfMinutes,
            editSoloStreakIsLoading,
            editSoloStreakErrorMessage,
        } = this.props;
        return (
            <View style={styles.container}>
                <Spacer>
                    <EditSoloStreakForm
                        editSoloStreak={editSoloStreak}
                        clearMessages={this.clearMessages}
                        soloStreakId={soloStreakId}
                        streakName={streakName}
                        editSoloStreakIsLoading={editSoloStreakIsLoading}
                        editSoloStreakErrorMessage={editSoloStreakErrorMessage}
                        streakDescription={streakDescription}
                        numberOfMinutes={numberOfMinutes}
                    />
                </Spacer>
            </View>
        );
    }
}

const EditSoloStreakScreen = connect(mapStateToProps, mapDispatchToProps)(EditSoloStreakScreenComponent);

export { EditSoloStreakScreen };
