import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { Text } from 'react-native-elements';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { View, StyleSheet, AppState as ReactNativeAppState } from 'react-native';

import { teamStreakActions, teamMemberStreakTaskActions } from '../actions/authenticatedSharedActions';
import { AppState } from '../../store';
import { Screens } from './Screens';
import { LiveTeamStreakList } from '../components/LiveTeamStreakList';
import { Spacer } from '../components/Spacer';
import { ArchivedTeamStreakList } from '../components/ArchivedTeamStreakList';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArchive } from '@fortawesome/pro-solid-svg-icons';
import { MaximumNumberOfFreeStreaksMessage } from '../components/MaximumNumberOfFreeStreaksMessage';
import { getCompletePercentageForStreaks } from '../helpers/getCompletePercentageForStreaks';
import { ProgressBar } from '../components/ProgressBar';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';

const getIncompleteTeamStreaks = (state: AppState) => {
    return (
        state &&
        state.teamStreaks &&
        state.teamStreaks.liveTeamStreaks &&
        state.teamStreaks.liveTeamStreaks.filter(
            (teamStreak) => !teamStreak.completedToday && teamStreak.status === StreakStatus.live,
        )
    );
};

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
    const incompleteTeamStreaks = getIncompleteTeamStreaks(state);
    const totalNumberOfTeamStreaks =
        state && state.teamStreaks && state.teamStreaks.liveTeamStreaks && state.teamStreaks.liveTeamStreaks.length;
    return {
        liveTeamStreaks,
        getMultipleLiveTeamStreaksIsLoading,
        archivedTeamStreaks,
        getMultipleArchivedTeamStreaksIsLoading,
        userId,
        currentUser,
        totalLiveStreaks,
        isPayingMember,
        incompleteTeamStreaks,
        totalNumberOfTeamStreaks,
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

type TeamStreaksScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.TeamStreaks>;
type TeamStreaksScreenRouteProp = RouteProp<RootStackParamList, Screens.TeamStreaks>;

type NavigationProps = {
    navigation: TeamStreaksScreenNavigationProp;
    route: TeamStreaksScreenRouteProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class TeamStreaksScreenComponent extends PureComponent<Props> {
    componentDidMount() {
        const { isPayingMember, totalLiveStreaks } = this.props;
        const currentUserId = this.props.currentUser._id;
        if (currentUserId) {
            this.props.getLiveTeamStreaks({ currentUserId });
        }
        this.props.getArchivedTeamStreaks();
        this.props.navigation.setParams({ isPayingMember, totalLiveStreaks });
        ReactNativeAppState.addEventListener('change', this._handleAppStateChange);
    }

    componentDidUpdate(prevProps: Props) {
        const { getMultipleLiveTeamStreaksIsLoading } = this.props;
        if (prevProps.getMultipleLiveTeamStreaksIsLoading !== getMultipleLiveTeamStreaksIsLoading) {
            this.props.navigation.setParams({ getMultipleLiveTeamStreaksIsLoading });
        }
    }

    componentWillUnmount() {
        ReactNativeAppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState: string) => {
        if (nextAppState === 'active') {
            const currentUserId = this.props.currentUser._id;
            if (currentUserId) {
                this.props.getLiveTeamStreaks({ currentUserId });
            }
        }
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
            isPayingMember,
            currentUser,
            incompleteTeamStreaks,
            totalNumberOfTeamStreaks,
        } = this.props;
        const totalLiveStreaks = currentUser && currentUser.totalLiveStreaks;
        return (
            <View style={styles.container}>
                <ScrollView>
                    <ProgressBar
                        completePercentage={getCompletePercentageForStreaks({
                            numberOfIncompleteStreaks: incompleteTeamStreaks.length,
                            numberOfStreaks: totalNumberOfTeamStreaks,
                        })}
                        fullScreen={true}
                    />
                    {!isPayingMember ? (
                        <View style={{ marginLeft: 15, marginTop: 15 }}>
                            <MaximumNumberOfFreeStreaksMessage
                                isPayingMember={isPayingMember}
                                totalLiveStreaks={totalLiveStreaks}
                            />
                        </View>
                    ) : null}
                    <View style={{ marginLeft: 15, marginRight: 15, marginBottom: 15 }}>
                        <LiveTeamStreakList
                            navigation={this.props.navigation}
                            getTeamStreak={getTeamStreak}
                            getLiveTeamStreaks={getLiveTeamStreaks}
                            getMultipleLiveTeamStreaksIsLoading={getMultipleLiveTeamStreaksIsLoading}
                            completeTeamMemberStreakTask={completeTeamMemberStreakTask}
                            incompleteTeamMemberStreakTask={incompleteTeamMemberStreakTask}
                            teamStreaks={liveTeamStreaks}
                            userId={userId}
                            totalNumberOfTeamStreaks={liveTeamStreaks.length}
                        />
                    </View>
                    <Spacer>
                        <Text style={{ fontWeight: 'bold' }}>
                            Archived Team Streaks <FontAwesomeIcon icon={faArchive} />
                        </Text>
                        <ArchivedTeamStreakList
                            navigation={this.props.navigation}
                            getTeamStreak={getTeamStreak}
                            getArchivedTeamStreaks={getArchivedTeamStreaks}
                            archivedTeamStreaks={archivedTeamStreaks}
                            getMultipleArchivedTeamStreaksIsLoading={getMultipleArchivedTeamStreaksIsLoading}
                        />
                    </Spacer>
                </ScrollView>
            </View>
        );
    }
}

const TeamStreaksScreen = connect(mapStateToProps, mapDispatchToProps)(TeamStreaksScreenComponent);

export { TeamStreaksScreen };
