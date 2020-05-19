import React, { PureComponent } from 'react';
import { FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { NavigationState, NavigationParams, NavigationScreenProp, NavigationEvents } from 'react-navigation';
import { ListItem, Divider, Text, Avatar } from 'react-native-elements';

import { Spacer } from './Spacer';
import { TeamMemberStreakTaskButton } from './TeamMemberStreakTaskButton';
import { Screens } from '../screens/Screens';
import {
    PopulatedTeamStreakWithClientData,
    PopulatedTeamMemberWithClientData,
} from '@streakoid/streakoid-shared/lib/reducers/teamStreakReducer';
import { ErrorMessage } from './ErrorMessage';
import { teamStreakActions } from '../actions/sharedActions';
import { getStreakCompletionInfo } from '@streakoid/streakoid-shared/lib';
import NavigationService from '../screens/NavigationService';
import { StreakFlame } from './StreakFlame';

interface LiveTeamStreakListProps {
    getTeamStreak: typeof teamStreakActions.getSelectedTeamStreak;
    getLiveTeamStreaks: typeof teamStreakActions.getLiveTeamStreaks;
    completeTeamMemberStreakTask: ({
        teamStreakId,
        teamMemberStreakId,
    }: {
        teamStreakId: string;
        teamMemberStreakId: string;
    }) => void;
    incompleteTeamMemberStreakTask: ({
        teamStreakId,
        teamMemberStreakId,
    }: {
        teamStreakId: string;
        teamMemberStreakId: string;
    }) => void;
    getMultipleLiveTeamStreaksIsLoading: boolean;
    teamStreaks: PopulatedTeamStreakWithClientData[];
    userId: string;
    totalNumberOfTeamStreaks: number;
}

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = LiveTeamStreakListProps & NavigationProps;

class LiveTeamStreakList extends PureComponent<Props> {
    goToTeamStreakDetails = (teamStreakId: string): void => {
        const { getTeamStreak } = this.props;
        getTeamStreak(teamStreakId);
    };
    renderTeamStreaksList(): JSX.Element {
        const { completeTeamMemberStreakTask, incompleteTeamMemberStreakTask, teamStreaks, userId } = this.props;
        return (
            <FlatList
                data={teamStreaks}
                keyExtractor={(teamStreak: PopulatedTeamStreakWithClientData) => teamStreak._id}
                renderItem={({ item }) => {
                    const currentUserTeamMemberStreak:
                        | PopulatedTeamMemberWithClientData
                        | undefined = item.members.find((member) => member._id === userId);
                    const teamMemberStreakId =
                        currentUserTeamMemberStreak && currentUserTeamMemberStreak.teamMemberStreak._id;
                    if (!teamMemberStreakId) {
                        return null;
                    }
                    if (!currentUserTeamMemberStreak) {
                        return null;
                    }

                    const { teamMemberStreak } = currentUserTeamMemberStreak;
                    const {
                        completedToday,
                        completeTeamMemberStreakTaskIsLoading,
                        completeTeamMemberStreakTaskErrorMessage,
                        incompleteTeamMemberStreakTaskIsLoading,
                        incompleteTeamMemberStreakTaskErrorMessage,
                    } = teamMemberStreak;
                    const { _id, streakName, members, pastStreaks, currentStreak, timezone, createdAt } = item;
                    const userIsApartOfStreak = item.members.some((member) => member._id === userId);
                    const streakCompletionInfo = getStreakCompletionInfo({
                        pastStreaks,
                        currentStreak,
                        timezone,
                        createdAt: new Date(createdAt),
                    });
                    const daysSinceUserCompletedStreak =
                        streakCompletionInfo && streakCompletionInfo.daysSinceUserCompletedStreak;
                    const daysSinceUserCreatedStreak =
                        streakCompletionInfo && streakCompletionInfo.daysSinceUserCreatedStreak;
                    const negativeDayStreak = daysSinceUserCompletedStreak || daysSinceUserCreatedStreak || 0;
                    const maximumNumberOfTeamMembersToDisplay = 3;
                    return (
                        <View>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate(Screens.TeamStreakInfo, {
                                        _id,
                                        streakName,
                                        userIsApartOfStreak,
                                    })
                                }
                            >
                                <ListItem
                                    leftElement={
                                        <TeamMemberStreakTaskButton
                                            completeTeamMemberStreakTask={completeTeamMemberStreakTask}
                                            incompleteTeamMemberStreakTask={incompleteTeamMemberStreakTask}
                                            teamStreakId={_id}
                                            teamStreakName={streakName}
                                            teamMemberStreakId={teamMemberStreakId}
                                            completedToday={completedToday}
                                            incompleteTeamMemberStreakTaskIsLoading={
                                                incompleteTeamMemberStreakTaskIsLoading
                                            }
                                            completeTeamMemberStreakTaskIsLoading={
                                                completeTeamMemberStreakTaskIsLoading
                                            }
                                        />
                                    }
                                    rightElement={
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                            {members.length <= maximumNumberOfTeamMembersToDisplay ? (
                                                members.map((member) => {
                                                    return (
                                                        <Avatar
                                                            renderPlaceholderContent={<ActivityIndicator />}
                                                            rounded
                                                            key={member._id}
                                                            source={{
                                                                uri: member.profileImage,
                                                            }}
                                                        />
                                                    );
                                                })
                                            ) : (
                                                <View style={{ flexDirection: 'row' }}>
                                                    {members
                                                        .slice(0, maximumNumberOfTeamMembersToDisplay)
                                                        .map((member) => {
                                                            return (
                                                                <Avatar
                                                                    renderPlaceholderContent={<ActivityIndicator />}
                                                                    rounded
                                                                    key={member._id}
                                                                    source={{
                                                                        uri: member.profileImage,
                                                                    }}
                                                                />
                                                            );
                                                        })}
                                                    <Text>+{members.length - maximumNumberOfTeamMembersToDisplay}</Text>
                                                </View>
                                            )}
                                        </View>
                                    }
                                    title={item.streakName}
                                    subtitle={
                                        <StreakFlame
                                            currentStreakNumberOfDaysInARow={currentStreak.numberOfDaysInARow}
                                            negativeDayStreak={negativeDayStreak}
                                        />
                                    }
                                />
                            </TouchableOpacity>

                            {completeTeamMemberStreakTaskErrorMessage ? (
                                <Spacer>
                                    <ErrorMessage message={completeTeamMemberStreakTaskErrorMessage} />
                                </Spacer>
                            ) : null}
                            {incompleteTeamMemberStreakTaskErrorMessage ? (
                                <Spacer>
                                    <ErrorMessage message={incompleteTeamMemberStreakTaskErrorMessage} />
                                </Spacer>
                            ) : null}

                            <Divider />
                        </View>
                    );
                }}
            />
        );
    }

    render(): JSX.Element {
        const {
            teamStreaks,
            totalNumberOfTeamStreaks,
            getLiveTeamStreaks,
            getMultipleLiveTeamStreaksIsLoading,
            userId,
        } = this.props;
        return (
            <>
                <NavigationEvents
                    onWillFocus={() => {
                        if (userId) {
                            getLiveTeamStreaks();
                        }
                    }}
                />
                {totalNumberOfTeamStreaks === 0 && !getMultipleLiveTeamStreaksIsLoading ? (
                    <TouchableOpacity
                        onPress={() => NavigationService.navigate(Screens.CreateTeamStreak)}
                        style={{ marginTop: 5 }}
                    >
                        <Text style={{ color: 'blue' }}>{`No team streaks. Create one`}</Text>
                    </TouchableOpacity>
                ) : null}
                {totalNumberOfTeamStreaks > 0 && teamStreaks.length === 0 ? (
                    <Spacer>
                        <Text style={{ color: '#4caf50' }}>All done for today</Text>
                    </Spacer>
                ) : null}
                {this.renderTeamStreaksList()}
            </>
        );
    }
}

export { LiveTeamStreakList };
