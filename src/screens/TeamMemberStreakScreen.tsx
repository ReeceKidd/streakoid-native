import React, { Component } from 'react';

import { AppState } from '../../store';

import { AppActions, getStreakCompletionString } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { teamMemberStreakActions } from '../../actions/sharedActions';
import { Text, ListItem } from 'react-native-elements';
import { Spacer } from '../../components/Spacer';
import { NavigationScreenProp, NavigationState, NavigationEvents, ScrollView } from 'react-navigation';
import { LoadingScreenSpinner } from '../../components/LoadingScreenSpinner';
import { Screens } from './Screens';
import { connect } from 'react-redux';
import { LongestStreakCard } from '../../components/LongestStreakCard';
import { AverageStreakCard } from '../../components/AverageStreakCard';
import { TotalNumberOfDaysCard } from '../../components/TotalNumberOfDaysCard';
import { StreakStartDateCard } from '../../components/StreakStartDateCard';
import { DaysSinceStreakCreationCard } from '../../components/DaysSinceStreakCreationCard';
import { StreakRestartsCard } from '../../components/StreakRestartsCard';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GeneralActivityFeed } from '../../components/GeneralActivityFeed';
import { FontAwesome5 } from '@expo/vector-icons';
import { Share } from 'react-native';
import { Button } from 'react-native-elements';
import { streakoidUrl } from '../../streakoidUrl';
import { RouterCategories } from '@streakoid/streakoid-sdk/lib';

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

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, { _id: string; streakName: string; isUsersStreak: boolean }>;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

class TeamMemberStreakInfoScreenComponent extends Component<Props> {
    static navigationOptions = ({
        navigation,
    }: {
        navigation: NavigationScreenProp<NavigationState, { _id: string; streakName: string; isUsersStreak: boolean }>;
    }) => {
        const streakId = navigation.getParam('_id');
        const streakName = navigation.getParam('streakName');
        return {
            title: streakName,
            headerRight: (
                <Button
                    type="clear"
                    icon={<FontAwesome5 name="share-alt" size={20} />}
                    onPress={async () => {
                        await Share.share({
                            message: `View team member streak ${streakName} at ${streakoidUrl}/${RouterCategories.teamMemberStreaks}/${streakId}`,
                            url: `${streakoidUrl}/${RouterCategories.teamMemberStreaks}/${streakId}`,
                            title: `View Streakoid team member streak ${streakName}`,
                        });
                    }}
                />
            ),
        };
    };

    render(): JSX.Element | null {
        const { selectedTeamMemberStreak, getTeamMemberStreakIsLoading } = this.props;
        const streakCompletionString = getStreakCompletionString({
            pastStreaks: selectedTeamMemberStreak.pastStreaks,
            currentStreak: selectedTeamMemberStreak.currentStreak,
            timezone: selectedTeamMemberStreak.timezone,
            createdAt: new Date(selectedTeamMemberStreak.createdAt),
        });
        return (
            <>
                {getTeamMemberStreakIsLoading ? (
                    <LoadingScreenSpinner />
                ) : (
                    <ScrollView>
                        <NavigationEvents
                            onWillFocus={() => this.props.getTeamMemberStreak(this.props.navigation.getParam('_id'))}
                        />
                        <Spacer>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate(Screens.UserProfile, {
                                        username: selectedTeamMemberStreak.username,
                                        _id: selectedTeamMemberStreak.userId,
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

                            <Text h4 h4Style={{ color: streakCompletionString.error ? 'red' : 'green' }}>
                                {streakCompletionString.string}
                            </Text>
                            {selectedTeamMemberStreak && selectedTeamMemberStreak.teamStreakDescription ? (
                                <Text h4>
                                    {selectedTeamMemberStreak && selectedTeamMemberStreak.teamStreakDescription}
                                </Text>
                            ) : null}
                        </Spacer>

                        <Spacer>
                            <Text style={{ fontWeight: 'bold' }}>Stats</Text>
                            <LongestStreakCard longestStreak={selectedTeamMemberStreak.longestStreak} />
                            <AverageStreakCard averageStreak={selectedTeamMemberStreak.averageStreak} />
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
