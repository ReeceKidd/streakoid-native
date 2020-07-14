import React, { PureComponent } from 'react';
import { SoloStreakListItem } from '@streakoid/streakoid-shared/lib/reducers/soloStreakReducer';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { ListItem, Divider, Text, Button } from 'react-native-elements';

import { SoloStreakTaskButton } from './SoloStreakTaskButton';
import { Screens } from '../screens/Screens';
import { getStreakCompletionInfo } from '@streakoid/streakoid-shared/lib';
import { soloStreakActions } from '../actions/authenticatedSharedActions';
import { StreakFlame } from './StreakFlame';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { Spacer } from './Spacer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCoins } from '@fortawesome/pro-solid-svg-icons';

interface LiveSoloStreakListProps {
    navigation: StackNavigationProp<RootStackParamList, Screens.Home | Screens.SoloStreaks>;
    userId: string;
    getSoloStreak: typeof soloStreakActions.getSoloStreak;
    completeSoloStreakListTask: typeof soloStreakActions.completeSoloStreakListTask;
    incompleteSoloStreakListTask: typeof soloStreakActions.incompleteSoloStreakListTask;
    recoverSoloStreak: typeof soloStreakActions.recoverSoloStreak;
    liveSoloStreaks: SoloStreakListItem[];
    getMultipleLiveSoloStreaksIsLoading: boolean;
    totalNumberOfSoloStreaks: number;
}

type Props = LiveSoloStreakListProps;

class LiveSoloStreakList extends PureComponent<Props> {
    renderSoloStreakList(): JSX.Element {
        const { userId, liveSoloStreaks, completeSoloStreakListTask, incompleteSoloStreakListTask } = this.props;
        return (
            <FlatList
                data={liveSoloStreaks}
                keyExtractor={(soloStreak: SoloStreakListItem) => soloStreak._id}
                renderItem={({ item }) => {
                    const {
                        _id,
                        completedToday,
                        completeSoloStreakListTaskIsLoading,
                        incompleteSoloStreakListTaskIsLoading,
                        pastStreaks,
                        currentStreak,
                        recoverSoloStreakErrorMessage,
                        recoverSoloStreakIsLoading,
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
                        <>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate(Screens.SoloStreakInfo, {
                                        _id: item._id,
                                        streakName: item.streakName,
                                        isUsersStreak: item.userId == userId,
                                    })
                                }
                            >
                                <ListItem
                                    leftElement={
                                        <SoloStreakTaskButton
                                            completeSoloStreakListTask={completeSoloStreakListTask}
                                            incompleteSoloStreakListTask={incompleteSoloStreakListTask}
                                            soloStreakId={_id}
                                            soloStreakName={item.streakName}
                                            currentStreakNumberOfDaysInARow={item.currentStreak.numberOfDaysInARow}
                                            completedToday={completedToday}
                                            incompleteSoloStreakListTaskIsLoading={
                                                incompleteSoloStreakListTaskIsLoading
                                            }
                                            completeSoloStreakListTaskIsLoading={completeSoloStreakListTaskIsLoading}
                                        />
                                    }
                                    rightElement={
                                        <StreakFlame
                                            currentStreakNumberOfDaysInARow={currentStreak.numberOfDaysInARow}
                                            negativeDayStreak={negativeDayStreak}
                                        />
                                    }
                                    title={item.streakName}
                                />
                            </TouchableOpacity>
                            {negativeDayStreak === 1 ? (
                                <View>
                                    <Text>Forget to complete this streak yesterday? </Text>
                                    <Spacer>
                                        <Button
                                            loading={recoverSoloStreakIsLoading}
                                            onPress={() => this.props.recoverSoloStreak({ soloStreakId: _id })}
                                            title={`Restore this streak for 1000 `}
                                            iconRight={true}
                                            icon={<FontAwesomeIcon icon={faCoins} color={'gold'} />}
                                        />
                                    </Spacer>

                                    {recoverSoloStreakErrorMessage ? (
                                        <Text style={{ color: 'red' }}>{recoverSoloStreakErrorMessage}</Text>
                                    ) : null}
                                </View>
                            ) : null}
                            <Divider />
                        </>
                    );
                }}
            />
        );
    }

    render(): JSX.Element {
        const { liveSoloStreaks, totalNumberOfSoloStreaks, getMultipleLiveSoloStreaksIsLoading } = this.props;
        return (
            <>
                {totalNumberOfSoloStreaks === 0 && !getMultipleLiveSoloStreaksIsLoading ? (
                    <View style={{ marginTop: 5 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate(Screens.CreateSoloStreak)}>
                            <Text style={{ color: 'blue' }}>{`No solo streaks found. Add one`}</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
                {totalNumberOfSoloStreaks > 0 && liveSoloStreaks.length === 0 ? (
                    <Text style={{ color: '#4caf50', marginTop: 5 }}>All done for today</Text>
                ) : null}
                {this.renderSoloStreakList()}
            </>
        );
    }
}

export { LiveSoloStreakList };
