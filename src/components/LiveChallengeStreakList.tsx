import React, { PureComponent } from 'react';
import { ChallengeStreakListItem } from '@streakoid/streakoid-shared/lib/reducers/challengeStreakReducer';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { NavigationState, NavigationParams, NavigationScreenProp, NavigationEvents } from 'react-navigation';
import { ListItem, Divider, Text } from 'react-native-elements';

import { ChallengeStreakTaskButton } from './ChallengeStreakTaskButton';
import { NavigationLink } from './NavigationLink';
import { Screens } from '../screens/Screens';
import { challengeStreakActions } from '../actions/sharedActions';
import { getStreakCompletionInfo } from '@streakoid/streakoid-shared/lib';
import { Spacer } from './Spacer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFlame } from '@fortawesome/pro-solid-svg-icons';

interface LiveChallengeStreakListProps {
    getChallengeStreak: typeof challengeStreakActions.getChallengeStreak;
    getLiveChallengeStreaks: typeof challengeStreakActions.getLiveChallengeStreaks;
    getMultipleLiveChallengeStreaksIsLoading: boolean;
    completeChallengeStreakListTask: typeof challengeStreakActions.completeChallengeStreakListTask;
    incompleteChallengeStreakListTask: typeof challengeStreakActions.incompleteChallengeStreakListTask;
    liveChallengeStreaks: ChallengeStreakListItem[];
    totalNumberOfChallengeStreaks: number;
    userId: string;
}

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = LiveChallengeStreakListProps & NavigationProps;

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
                    const negativeDayValue = daysSinceUserCompletedStreak || daysSinceUserCreatedStreak || 0;
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
                                        currentStreak.numberOfDaysInARow > 0 ? (
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: 'bold' }}>
                                                    {currentStreak.numberOfDaysInARow}
                                                </Text>
                                                <FontAwesomeIcon icon={faFlame} style={{ color: 'red' }} />
                                            </View>
                                        ) : (
                                            <>
                                                {negativeDayValue === 0 ? (
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ fontWeight: 'bold' }}>{negativeDayValue}</Text>
                                                        <FontAwesomeIcon icon={faFlame} style={{ color: 'gray' }} />
                                                    </View>
                                                ) : (
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ fontWeight: 'bold' }}>-{negativeDayValue}</Text>
                                                        <FontAwesomeIcon icon={faFlame} style={{ color: 'blue' }} />
                                                    </View>
                                                )}
                                            </>
                                        )
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
            userId,
            getLiveChallengeStreaks,
        } = this.props;

        return (
            <>
                <NavigationEvents
                    onWillFocus={() => {
                        if (userId) {
                            getLiveChallengeStreaks();
                        }
                    }}
                />
                {totalNumberOfChallengeStreaks === 0 && !getMultipleLiveChallengeStreaksIsLoading ? (
                    <View style={{ marginTop: 5 }}>
                        <NavigationLink
                            navigation={this.props.navigation}
                            text="No challenge streaks found. Join one"
                            screen={Screens.Challenges}
                        />
                    </View>
                ) : null}
                {totalNumberOfChallengeStreaks > 0 && liveChallengeStreaks.length === 0 ? (
                    <Spacer>
                        <Text style={{ color: '#4caf50' }}>All done for today</Text>
                    </Spacer>
                ) : null}
                {this.renderLiveChallengeStreakList()}
            </>
        );
    }
}

export { LiveChallengeStreakList };
