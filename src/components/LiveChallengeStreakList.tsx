import React, { PureComponent } from 'react';
import { ChallengeStreakListItem } from '@streakoid/streakoid-shared/lib/reducers/challengeStreakReducer';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { ListItem, Divider, Text } from 'react-native-elements';

import { ChallengeStreakTaskButton } from './ChallengeStreakTaskButton';
import { Screens } from '../screens/Screens';
import { challengeStreakActions } from '../actions/authenticatedSharedActions';
import { getStreakCompletionInfo } from '@streakoid/streakoid-shared/lib';
import { StreakFlame } from './StreakFlame';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';

interface LiveChallengeStreakListProps {
    navigation: StackNavigationProp<RootStackParamList, Screens.Home | Screens.ChallengeStreaks>;
    getChallengeStreak: typeof challengeStreakActions.getChallengeStreak;
    getLiveChallengeStreaks: typeof challengeStreakActions.getLiveChallengeStreaks;
    getMultipleLiveChallengeStreaksIsLoading: boolean;
    completeChallengeStreakListTask: typeof challengeStreakActions.completeChallengeStreakListTask;
    incompleteChallengeStreakListTask: typeof challengeStreakActions.incompleteChallengeStreakListTask;
    liveChallengeStreaks: ChallengeStreakListItem[];
    totalNumberOfChallengeStreaks: number;
    userId: string;
}

type Props = LiveChallengeStreakListProps;

class LiveChallengeStreakList extends PureComponent<Props> {
    renderLiveChallengeStreakList(): JSX.Element {
        const { liveChallengeStreaks, completeChallengeStreakListTask, incompleteChallengeStreakListTask } = this.props;
        return (
            <FlatList
                data={liveChallengeStreaks}
                keyExtractor={(challengeStreak: ChallengeStreakListItem) => challengeStreak._id}
                renderItem={({ item }) => {
                    const {
                        _id,
                        completedToday,
                        completeChallengeStreakListTaskIsLoading,
                        incompleteChallengeStreakListTaskIsLoading,
                        pastStreaks,
                        currentStreak,
                        timezone,
                        createdAt,
                    } = item;
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
                    return (
                        <View>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate(Screens.ChallengeStreakInfo, {
                                        _id: item._id,
                                        streakName: item.challengeName,
                                    })
                                }
                            >
                                <ListItem
                                    leftElement={
                                        <ChallengeStreakTaskButton
                                            completeChallengeStreakListTask={completeChallengeStreakListTask}
                                            incompleteChallengeStreakListTask={incompleteChallengeStreakListTask}
                                            challengeStreakId={_id}
                                            challengeId={item.challengeId}
                                            challengeName={item.challengeName}
                                            currentStreakNumberOfDaysInARow={item.currentStreak.numberOfDaysInARow}
                                            completedToday={completedToday}
                                            incompleteChallengeStreakListTaskIsLoading={
                                                incompleteChallengeStreakListTaskIsLoading
                                            }
                                            completeChallengeStreakListTaskIsLoading={
                                                completeChallengeStreakListTaskIsLoading
                                            }
                                        />
                                    }
                                    rightElement={
                                        <StreakFlame
                                            currentStreakNumberOfDaysInARow={currentStreak.numberOfDaysInARow}
                                            negativeDayStreak={negativeDayStreak}
                                        />
                                    }
                                    title={item.challengeName}
                                />
                            </TouchableOpacity>
                            <Divider />
                        </View>
                    );
                }}
            />
        );
    }

    render(): JSX.Element {
        const {
            liveChallengeStreaks,
            getMultipleLiveChallengeStreaksIsLoading,
            totalNumberOfChallengeStreaks,
        } = this.props;
        return (
            <>
                {totalNumberOfChallengeStreaks === 0 && !getMultipleLiveChallengeStreaksIsLoading ? (
                    <View style={{ marginTop: 5 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate(Screens.Challenges)}>
                            <Text style={{ color: 'blue' }}>{`No challenge streaks found. Join one`}</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
                {totalNumberOfChallengeStreaks > 0 && liveChallengeStreaks.length === 0 ? (
                    <Text style={{ color: '#4caf50', marginTop: 5 }}>All done for today</Text>
                ) : null}
                {this.renderLiveChallengeStreakList()}
            </>
        );
    }
}

export { LiveChallengeStreakList };
