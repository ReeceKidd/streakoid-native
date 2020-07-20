import React from 'react';
import { FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { ListItem, Divider, Text, Avatar, Button } from 'react-native-elements';

import { Spacer } from './Spacer';
import { TeamMemberStreakTaskButton } from './TeamMemberStreakTaskButton';
import { Screens } from '../screens/Screens';
import {
    PopulatedTeamStreakWithClientData,
    PopulatedTeamMemberWithClientData,
} from '@streakoid/streakoid-shared/lib/reducers/teamStreakReducer';
import { ErrorMessage } from './ErrorMessage';
import { teamStreakActions, teamMemberStreakTaskActions } from '../actions/authenticatedSharedActions';
import { getStreakCompletionInfo } from '@streakoid/streakoid-shared/lib';
import { StreakFlame } from './StreakFlame';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';

interface LiveTeamStreakListProps {
    navigation: StackNavigationProp<RootStackParamList, Screens.Home | Screens.TeamStreaks>;
    getTeamStreak: typeof teamStreakActions.getSelectedTeamStreak;
    getLiveTeamStreaks: typeof teamStreakActions.getLiveTeamStreaks;
    completeTeamMemberStreakTask: typeof teamMemberStreakTaskActions.completeTeamMemberStreakTask;
    incompleteTeamMemberStreakTask: typeof teamMemberStreakTaskActions.incompleteTeamMemberStreakTask;
    recoverTeamMemberStreak: typeof teamStreakActions.recoverTeamMemberStreak;
    getMultipleLiveTeamStreaksIsLoading: boolean;
    teamStreaks: PopulatedTeamStreakWithClientData[];
    userId: string;
    totalNumberOfTeamStreaks: number;
}

type Props = LiveTeamStreakListProps;

const LiveTeamStreakList = (props: Props) => {
    const {
        completeTeamMemberStreakTask,
        incompleteTeamMemberStreakTask,
        recoverTeamMemberStreak,
        teamStreaks,
        totalNumberOfTeamStreaks,
        getMultipleLiveTeamStreaksIsLoading,
        userId,
        navigation,
    } = props;
    return (
        <>
            {totalNumberOfTeamStreaks === 0 && !getMultipleLiveTeamStreaksIsLoading ? (
                <TouchableOpacity
                    onPress={() => navigation.navigate(Screens.CreateTeamStreak)}
                    style={{ marginTop: 5 }}
                >
                    <Text style={{ color: 'blue' }}>{`No team streaks. Create one`}</Text>
                </TouchableOpacity>
            ) : null}
            {totalNumberOfTeamStreaks > 0 && teamStreaks.length === 0 ? (
                <Text style={{ color: '#4caf50', marginTop: 5 }}>All done for today</Text>
            ) : null}
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
                    const userIsApartOfStreak = Boolean(item.members.find((member) => member._id === userId));

                    const teamStreakCompletionInfo = getStreakCompletionInfo({
                        pastStreaks,
                        currentStreak,
                        timezone,
                        createdAt: new Date(createdAt),
                    });
                    const daysSinceUserCompletedTeamStreak =
                        teamStreakCompletionInfo && teamStreakCompletionInfo.daysSinceUserCompletedStreak;
                    const daysSinceUserCreatedTeamStreak =
                        teamStreakCompletionInfo && teamStreakCompletionInfo.daysSinceUserCreatedStreak;
                    const teamStreakNegativeDayStreak =
                        daysSinceUserCompletedTeamStreak || daysSinceUserCreatedTeamStreak || 0;

                    const teamMemberStreakCompletionInfo = getStreakCompletionInfo({
                        pastStreaks,
                        currentStreak,
                        timezone,
                        createdAt: new Date(createdAt),
                    });
                    const daysSinceUserCompletedTeamMemberStreak =
                        teamMemberStreakCompletionInfo && teamMemberStreakCompletionInfo.daysSinceUserCompletedStreak;
                    const daysSinceUserCreatedTeamMemberStreak =
                        teamMemberStreakCompletionInfo && teamMemberStreakCompletionInfo.daysSinceUserCreatedStreak;
                    const teamMemberStreakNegativeDayStreak =
                        daysSinceUserCompletedTeamMemberStreak || daysSinceUserCreatedTeamMemberStreak || 0;

                    const maximumNumberOfTeamMembersToDisplay = 3;

                    return (
                        <View>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate(Screens.TeamStreakInfo, {
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
                                                            containerStyle={{
                                                                borderWidth: 2,
                                                                borderColor: member.teamMemberStreak.completedToday
                                                                    ? 'green'
                                                                    : 'red',
                                                                overflow: 'hidden',
                                                                marginLeft: 2,
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
                                                                    containerStyle={{
                                                                        borderWidth: 2,
                                                                        borderColor: member.teamMemberStreak
                                                                            .completedToday
                                                                            ? 'green'
                                                                            : 'red',
                                                                        overflow: 'hidden',
                                                                        marginLeft: 2,
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
                                            negativeDayStreak={teamStreakNegativeDayStreak}
                                        />
                                    }
                                />
                            </TouchableOpacity>
                            {teamMemberStreakNegativeDayStreak === 1 ? (
                                <>
                                    <Text>Forget to click your {streakName} yesterday?</Text>
                                    <Spacer>
                                        <Button
                                            onPress={() => recoverTeamMemberStreak({ teamMemberStreakId })}
                                            title={`Restore this streak for 1000 `}
                                            iconRight={true}
                                            icon={<FontAwesomeIcon icon={faCoins} color={'gold'} />}
                                        />
                                    </Spacer>
                                </>
                            ) : null}

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
        </>
    );
};

export { LiveTeamStreakList };
