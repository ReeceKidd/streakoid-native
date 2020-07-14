import React, { PureComponent } from 'react';
import { ChallengeStreakListItem } from '@streakoid/streakoid-shared/lib/reducers/challengeStreakReducer';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { ListItem, Divider, Text, Button } from 'react-native-elements';

import { ChallengeStreakTaskButton } from './ChallengeStreakTaskButton';
import { Screens } from '../screens/Screens';
import { challengeStreakActions } from '../actions/authenticatedSharedActions';
import { getStreakCompletionInfo } from '@streakoid/streakoid-shared/lib';
import { StreakFlame } from './StreakFlame';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCoins } from '@fortawesome/pro-solid-svg-icons';
import { Spacer } from './Spacer';

interface LiveChallengeStreakListProps {
    navigation: StackNavigationProp<RootStackParamList, Screens.Home | Screens.ChallengeStreaks>;
    getChallengeStreak: typeof challengeStreakActions.getChallengeStreak;
    getLiveChallengeStreaks: typeof challengeStreakActions.getLiveChallengeStreaks;
    completeChallengeStreakListTask: typeof challengeStreakActions.completeChallengeStreakListTask;
    incompleteChallengeStreakListTask: typeof challengeStreakActions.incompleteChallengeStreakListTask;
    recoverChallengeStreak: typeof challengeStreakActions.recoverChallengeStreak;
    getLiveChallengeStreaksIsLoading: boolean;
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
                        recoverChallengeStreakErrorMessage,
                        recoverChallengeStreakIsLoading,
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
                                        challengeName: item.challengeName,
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
                            {negativeDayStreak === 1 ? (
                                <View>
                                    <Text>Forget to complete this streak yesterday? </Text>
                                    <Spacer>
                                        <Button
                                            loading={recoverChallengeStreakIsLoading}
                                            onPress={() =>
                                                this.props.recoverChallengeStreak({ challengeStreakId: _id })
                                            }
                                            title={`Restore this streak for 1000 `}
                                            iconRight={true}
                                            icon={<FontAwesomeIcon icon={faCoins} color={'gold'} />}
                                        />
                                    </Spacer>

                                    {recoverChallengeStreakErrorMessage ? (
                                        <Text style={{ color: 'red' }}>{recoverChallengeStreakErrorMessage}</Text>
                                    ) : null}
                                </View>
                            ) : null}
                            <Divider />
                        </View>
                    );
                }}
            />
        );
    }

    render(): JSX.Element {
        const { liveChallengeStreaks, getLiveChallengeStreaksIsLoading, totalNumberOfChallengeStreaks } = this.props;
        return (
            <>
                {totalNumberOfChallengeStreaks === 0 && !getLiveChallengeStreaksIsLoading ? (
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
