import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../store';
import { ScrollView, TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import { Spacer } from '../components/Spacer';
import { AppActions, getStreakCompletionInfo } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { leaderboardActions } from '../actions/authenticatedSharedActions';
import { Screens } from './Screens';
import { Divider, Text } from 'react-native-elements';
import { View, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChild } from '@fortawesome/pro-solid-svg-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { RouteProp } from '@react-navigation/native';
import { IndividualStreakLeaderboardItem } from '../components/IndividualStreakLeaderboardItem';

const mapStateToProps = (state: AppState) => {
    const teamMemberStreakLeaderboard = state && state.leaderboards && state.leaderboards.teamMemberStreakLeaderboard;
    const getTeamMemberStreakLeaderboardIsLoading =
        state && state.leaderboards && state.leaderboards.getTeamMemberStreakLeaderboardIsLoading;
    const getTeamMemberStreakLeaderboardErrorMessage =
        state && state.leaderboards && state.leaderboards.getTeamMemberStreakLeaderboardErrorMessage;
    return {
        teamMemberStreakLeaderboard,
        getTeamMemberStreakLeaderboardIsLoading,
        getTeamMemberStreakLeaderboardErrorMessage,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getTeamMemberStreaksLeaderboard: bindActionCreators(leaderboardActions.getTeamMemberStreakLeaderboard, dispatch),
});

type TeamMemberStreakLeaderboardScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    Screens.TeamMemberStreakLeaderboard
>;
type TeamMemberStreakLeaderboardScreenRouteProp = RouteProp<RootStackParamList, Screens.TeamMemberStreakLeaderboard>;

type NavigationProps = {
    navigation: TeamMemberStreakLeaderboardScreenNavigationProp;
    route: TeamMemberStreakLeaderboardScreenRouteProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

class TeamMemberStreakLeaderboardScreenComponent extends PureComponent<Props> {
    componentDidMount() {
        this.props.getTeamMemberStreaksLeaderboard();
    }
    renderTeamMemberStreakLeaderboard(): JSX.Element {
        const { teamMemberStreakLeaderboard } = this.props;
        return (
            <FlatList
                data={teamMemberStreakLeaderboard}
                keyExtractor={(teamMemberStreakLeaderboardItem) => teamMemberStreakLeaderboardItem.streakId}
                renderItem={({ item, index }) => {
                    const {
                        currentStreak,
                        pastStreaks,
                        timezone,
                        streakCreatedAt,
                        streakId,
                        streakName,
                        userProfileImage,
                        longestTeamMemberStreakNumberOfDays,
                        totalTimesTracked,
                    } = item;
                    const streakCompletionInfo = getStreakCompletionInfo({
                        pastStreaks,
                        currentStreak,
                        timezone,
                        createdAt: new Date(streakCreatedAt),
                    });
                    const daysSinceUserCompletedStreak =
                        streakCompletionInfo && streakCompletionInfo.daysSinceUserCompletedStreak;
                    const daysSinceUserCreatedStreak =
                        streakCompletionInfo && streakCompletionInfo.daysSinceUserCreatedStreak;
                    const negativeDayStreak = daysSinceUserCompletedStreak || daysSinceUserCreatedStreak || 0;
                    return (
                        <>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate(Screens.TeamMemberStreakInfo, {
                                        _id: streakId,
                                        streakName: streakName,
                                    })
                                }
                            >
                                <IndividualStreakLeaderboardItem
                                    index={index}
                                    currentStreakNumberOfDaysInARow={currentStreak.numberOfDaysInARow}
                                    longestStreakNumberOfDaysInARow={longestTeamMemberStreakNumberOfDays}
                                    negativeDayStreak={negativeDayStreak}
                                    streakName={streakName}
                                    totalTimesTracked={totalTimesTracked}
                                    userProfileImage={userProfileImage}
                                />
                            </TouchableOpacity>
                            <Divider />
                        </>
                    );
                }}
            />
        );
    }

    render(): JSX.Element | null {
        const { getTeamMemberStreakLeaderboardIsLoading } = this.props;
        return (
            <ScrollView>
                <Spacer>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                            TeamMember Streak Leaderboard <FontAwesomeIcon icon={faChild} />
                        </Text>
                        {getTeamMemberStreakLeaderboardIsLoading ? (
                            <ActivityIndicator style={{ marginLeft: 10 }} />
                        ) : null}
                    </View>
                    {this.renderTeamMemberStreakLeaderboard()}
                </Spacer>
            </ScrollView>
        );
    }
}

const TeamMemberStreakLeaderboardScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(TeamMemberStreakLeaderboardScreenComponent);
export { TeamMemberStreakLeaderboardScreen };
