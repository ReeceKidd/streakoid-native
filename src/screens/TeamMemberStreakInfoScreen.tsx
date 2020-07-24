import React, { PureComponent } from 'react';

import { AppState } from '../../store';

import { AppActions, getStreakCompletionInfo } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { teamMemberStreakActions } from '../actions/authenticatedSharedActions';
import { Text, ListItem } from 'react-native-elements';
import { Spacer } from '../components/Spacer';
import { LoadingScreenSpinner } from '../components/LoadingScreenSpinner';
import { Screens } from './Screens';
import { connect } from 'react-redux';
import { TotalNumberOfDaysCard } from '../components/TotalNumberOfDaysCard';
import { StreakStartDateCard } from '../components/StreakStartDateCard';
import { DaysSinceStreakCreationCard } from '../components/DaysSinceStreakCreationCard';
import { StreakRestartsCard } from '../components/StreakRestartsCard';
import { TouchableOpacity } from 'react-native';
import { GeneralActivityFeed } from '../components/GeneralActivityFeed';
import { StreakFlame } from '../components/StreakFlame';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { ScrollView } from 'react-native-gesture-handler';
import { LongestTeamMemberStreakCard } from './LongestTeamMemberStreakCard';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    const selectedUser = state && state.users && state.users.selectedUser;
    const selectedTeamMemberStreak =
        state && state.teamMemberStreaks && state.teamMemberStreaks.selectedTeamMemberStreak;
    const getTeamMemberStreakIsLoading =
        state && state.teamMemberStreaks && state.teamMemberStreaks.getTeamMemberStreakIsLoading;
    return {
        currentUser,
        selectedUser,
        selectedTeamMemberStreak,
        getTeamMemberStreakIsLoading,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getTeamMemberStreak: bindActionCreators(teamMemberStreakActions.getTeamMemberStreak, dispatch),
    clearSelectedTeamMemberStreak: bindActionCreators(teamMemberStreakActions.clearSelectedTeamMemberStreak, dispatch),
});

type TeamMemberStreakInfoScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.TeamMemberStreakInfo>;
type TeamMemberStreakInfoScreenRouteProp = RouteProp<RootStackParamList, Screens.TeamMemberStreakInfo>;

type NavigationProps = {
    navigation: TeamMemberStreakInfoScreenNavigationProp;
    route: TeamMemberStreakInfoScreenRouteProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

class TeamMemberStreakInfoScreenComponent extends PureComponent<Props> {
    componentDidMount() {
        this.props.getTeamMemberStreak(this.props.route.params._id);
    }
    render(): JSX.Element | null {
        const { selectedTeamMemberStreak, getTeamMemberStreakIsLoading } = this.props;
        const { pastStreaks, currentStreak, timezone, createdAt, longestTeamMemberStreak } = selectedTeamMemberStreak;
        const streakCompletionInfo = getStreakCompletionInfo({
            pastStreaks,
            currentStreak,
            timezone,
            createdAt: new Date(createdAt),
        });
        const daysSinceUserCompletedStreak = streakCompletionInfo && streakCompletionInfo.daysSinceUserCompletedStreak;
        const daysSinceUserCreatedStreak = streakCompletionInfo && streakCompletionInfo.daysSinceUserCreatedStreak;
        const negativeDayStreak = daysSinceUserCompletedStreak || daysSinceUserCreatedStreak || 0;
        return (
            <>
                {getTeamMemberStreakIsLoading ? (
                    <LoadingScreenSpinner />
                ) : (
                    <ScrollView>
                        <Spacer>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate(Screens.UserProfile, {
                                        username: selectedTeamMemberStreak.username,
                                        _id: selectedTeamMemberStreak.userId,
                                        profileImage: selectedTeamMemberStreak.userProfileImage,
                                    });
                                }}
                            >
                                <ListItem
                                    leftAvatar={{
                                        source: { uri: selectedTeamMemberStreak.userProfileImage },
                                    }}
                                    title={selectedTeamMemberStreak.username}
                                />
                            </TouchableOpacity>

                            <StreakFlame
                                currentStreakNumberOfDaysInARow={currentStreak.numberOfDaysInARow}
                                negativeDayStreak={negativeDayStreak}
                            />
                            {selectedTeamMemberStreak && selectedTeamMemberStreak.teamStreakDescription ? (
                                <Text h4>
                                    {selectedTeamMemberStreak && selectedTeamMemberStreak.teamStreakDescription}
                                </Text>
                            ) : null}
                        </Spacer>

                        <Spacer>
                            <Text style={{ fontWeight: 'bold' }}>Stats</Text>
                            <LongestTeamMemberStreakCard
                                navigation={this.props.navigation}
                                teamMemberStreakId={
                                    longestTeamMemberStreak && longestTeamMemberStreak.teamMemberStreakId
                                }
                                teamStreakName={longestTeamMemberStreak && longestTeamMemberStreak.teamStreakName}
                                numberOfDays={longestTeamMemberStreak && longestTeamMemberStreak.numberOfDays}
                                startDate={
                                    longestTeamMemberStreak &&
                                    longestTeamMemberStreak.startDate &&
                                    longestTeamMemberStreak.startDate.toString()
                                }
                                endDate={
                                    longestTeamMemberStreak &&
                                    longestTeamMemberStreak.endDate &&
                                    longestTeamMemberStreak.endDate.toString()
                                }
                            />
                            <TotalNumberOfDaysCard totalTimesTracked={selectedTeamMemberStreak.totalTimesTracked} />
                            <StreakStartDateCard createdAt={new Date(selectedTeamMemberStreak.createdAt)} />
                            <DaysSinceStreakCreationCard
                                daysSinceStreakCreation={selectedTeamMemberStreak.daysSinceStreakCreation}
                            />
                            <StreakRestartsCard numberOfRestarts={selectedTeamMemberStreak.numberOfRestarts} />
                        </Spacer>
                        <Spacer>
                            <Text style={{ fontWeight: 'bold' }}> Activity Feed </Text>
                            <GeneralActivityFeed
                                navigation={this.props.navigation}
                                activityFeedItems={selectedTeamMemberStreak.activityFeed.activityFeedItems}
                                currentUserId={this.props.currentUser._id}
                            />
                        </Spacer>
                    </ScrollView>
                )}
            </>
        );
    }
}

const TeamMemberStreakInfoScreen = connect(mapStateToProps, mapDispatchToProps)(TeamMemberStreakInfoScreenComponent);

export { TeamMemberStreakInfoScreen };
