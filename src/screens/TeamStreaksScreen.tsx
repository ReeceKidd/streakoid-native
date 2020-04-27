import React, { Component } from 'react';

import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationState, NavigationParams, withNavigationFocus } from 'react-navigation';
import { Button, Text } from 'react-native-elements';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { View, StyleSheet } from 'react-native';

import { teamStreakActions, teamMemberStreakTaskActions } from '../actions/sharedActions';
import { AppState } from '../../store';
import NavigationService from './NavigationService';
import { Screens } from './Screens';
import { LiveTeamStreakList } from '../components/LiveTeamStreakList';
import { HamburgerSelector } from '../components/HamburgerSelector';
import { Spacer } from '../components/Spacer';
import { ArchivedTeamStreakList } from '../components/ArchivedTeamStreakList';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faArchive } from '@fortawesome/pro-solid-svg-icons';

const mapStateToProps = (state: AppState) => {
    const liveTeamStreaks = state && state.teamStreaks && state.teamStreaks.liveTeamStreaks;
    const getMultipleLiveTeamStreaksIsLoading =
        state && state.teamStreaks && state.teamStreaks.getMultipleLiveTeamStreaksIsLoading;
    const archivedTeamStreaks = state && state.teamStreaks && state.teamStreaks.archivedTeamStreaks;
    const getMultipleArchivedTeamStreaksIsLoading =
        state && state.teamStreaks && state.teamStreaks.getMultipleArchivedTeamStreaksIsLoading;
    const userId = state.users && state.users.currentUser && state.users.currentUser._id;
    return {
        liveTeamStreaks,
        getMultipleLiveTeamStreaksIsLoading,
        archivedTeamStreaks,
        getMultipleArchivedTeamStreaksIsLoading,
        userId,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getLiveTeamStreaks: bindActionCreators(teamStreakActions.getLiveTeamStreaks, dispatch),
    getArchivedTeamStreaks: bindActionCreators(teamStreakActions.getArchivedTeamStreaks, dispatch),
    getTeamStreak: bindActionCreators(teamStreakActions.getSelectedTeamStreak, dispatch),
    completeTeamMemberStreakTask: bindActionCreators(
        teamMemberStreakTaskActions.completeTeamMemberStreakTask,
        dispatch,
    ),
    incompleteTeamMemberStreakTask: bindActionCreators(
        teamMemberStreakTaskActions.incompleteTeamMemberStreakTask,
        dispatch,
    ),
});

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    NavigationProps & { isFocused: true };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class TeamStreaksScreenComponent extends Component<Props> {
    static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationState, {}> }) => {
        return {
            title: 'Team Streaks',
            headerRight: (
                <Button
                    type="clear"
                    icon={<FontAwesomeIcon icon={faPlus} size={30} />}
                    onPress={() => NavigationService.navigate(Screens.CreateTeamStreak)}
                />
            ),
            headerLeft: () => <HamburgerSelector navigation={navigation} />,
        };
    };

    render(): JSX.Element {
        const {
            getTeamStreak,
            getLiveTeamStreaks,
            getArchivedTeamStreaks,
            getMultipleLiveTeamStreaksIsLoading,
            completeTeamMemberStreakTask,
            incompleteTeamMemberStreakTask,
            liveTeamStreaks,
            userId,
            archivedTeamStreaks,
            getMultipleArchivedTeamStreaksIsLoading,
        } = this.props;

        return (
            <View style={styles.container}>
                <ScrollView>
                    <Spacer>
                        <LiveTeamStreakList
                            getTeamStreak={getTeamStreak}
                            getLiveTeamStreaks={getLiveTeamStreaks}
                            getMultipleLiveTeamStreaksIsLoading={getMultipleLiveTeamStreaksIsLoading}
                            completeTeamMemberStreakTask={completeTeamMemberStreakTask}
                            incompleteTeamMemberStreakTask={incompleteTeamMemberStreakTask}
                            teamStreaks={liveTeamStreaks}
                            userId={userId}
                            navigation={this.props.navigation}
                            totalNumberOfTeamStreaks={liveTeamStreaks.length}
                        />
                    </Spacer>
                    <Spacer>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                            Archived Team Streaks <FontAwesomeIcon icon={faArchive} size={20} />
                        </Text>
                        <ArchivedTeamStreakList
                            getTeamStreak={getTeamStreak}
                            getArchivedTeamStreaks={getArchivedTeamStreaks}
                            archivedTeamStreaks={archivedTeamStreaks}
                            getMultipleArchivedTeamStreaksIsLoading={getMultipleArchivedTeamStreaksIsLoading}
                            navigation={this.props.navigation}
                        />
                    </Spacer>
                </ScrollView>
            </View>
        );
    }
}

const TeamStreaksScreen = withNavigationFocus(connect(mapStateToProps, mapDispatchToProps)(TeamStreaksScreenComponent));

export { TeamStreaksScreen };
