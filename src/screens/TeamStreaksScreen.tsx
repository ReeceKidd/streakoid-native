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
import { MaximumNumberOfFreeStreaksMessage } from '../components/MaximumNumberOfFreeStreaksMessage';
import { MAXIMUM_NUMBER_OF_FREE_STREAKS } from '../../config';

const mapStateToProps = (state: AppState) => {
    const liveTeamStreaks = state && state.teamStreaks && state.teamStreaks.liveTeamStreaks;
    const getMultipleLiveTeamStreaksIsLoading =
        state && state.teamStreaks && state.teamStreaks.getMultipleLiveTeamStreaksIsLoading;
    const archivedTeamStreaks = state && state.teamStreaks && state.teamStreaks.archivedTeamStreaks;
    const getMultipleArchivedTeamStreaksIsLoading =
        state && state.teamStreaks && state.teamStreaks.getMultipleArchivedTeamStreaksIsLoading;
    const userId = state.users && state.users.currentUser && state.users.currentUser._id;
    const currentUser = state && state.users && state.users.currentUser;
    const totalLiveStreaks = currentUser && currentUser.totalLiveStreaks;
    const isPayingMember =
        currentUser && currentUser.membershipInformation && currentUser.membershipInformation.isPayingMember;
    return {
        liveTeamStreaks,
        getMultipleLiveTeamStreaksIsLoading,
        archivedTeamStreaks,
        getMultipleArchivedTeamStreaksIsLoading,
        userId,
        currentUser,
        totalLiveStreaks,
        isPayingMember,
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
    static navigationOptions = ({
        navigation,
    }: {
        navigation: NavigationScreenProp<NavigationState, { isPayingMember: boolean; totalLiveStreaks: number }>;
    }) => {
        const isPayingMember = navigation.getParam('isPayingMember');
        const totalLiveStreaks = navigation.getParam('totalLiveStreaks');
        const userHasReachedFreeStreakLimit = !isPayingMember && totalLiveStreaks > MAXIMUM_NUMBER_OF_FREE_STREAKS;
        return {
            title: 'Team Streaks',
            headerRight: (
                <Button
                    type="clear"
                    icon={<FontAwesomeIcon icon={faPlus} size={30} />}
                    onPress={() => {
                        if (!userHasReachedFreeStreakLimit) {
                            return NavigationService.navigate(Screens.CreateTeamStreak);
                        }
                        NavigationService.navigate(Screens.Upgrade);
                    }}
                />
            ),
            headerLeft: () => <HamburgerSelector navigation={navigation} />,
        };
    };

    componentDidMount() {
        const { isPayingMember, totalLiveStreaks } = this.props;
        this.props.navigation.setParams({ isPayingMember, totalLiveStreaks });
    }

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
            isPayingMember,
            currentUser,
        } = this.props;
        const totalLiveStreaks = currentUser && currentUser.totalLiveStreaks;
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={{ marginLeft: 15, marginTop: 15 }}>
                        <MaximumNumberOfFreeStreaksMessage
                            isPayingMember={isPayingMember}
                            totalLiveStreaks={totalLiveStreaks}
                        />
                    </View>

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
                            Archived Team Streaks <FontAwesomeIcon icon={faArchive} />
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
