import React, { PureComponent } from 'react';
import { SoloStreakListItem } from '@streakoid/streakoid-shared/lib/reducers/soloStreakReducer';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { ListItem, Divider, Text } from 'react-native-elements';

import { SoloStreakTaskButton } from './SoloStreakTaskButton';
import { Screens } from '../screens/Screens';
import { getStreakCompletionInfo } from '@streakoid/streakoid-shared/lib';
import { soloStreakActions } from '../actions/authenticatedSharedActions';
import { StreakFlame } from './StreakFlame';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';

interface LiveSoloStreakListProps {
    navigation: StackNavigationProp<RootStackParamList, Screens.Home | Screens.SoloStreaks>;
    userId: string;
    getSoloStreak: typeof soloStreakActions.getSoloStreak;
    completeSoloStreakListTask: (soloStreakId: string) => void;
    incompleteSoloStreakListTask: (soloStreakId: string) => void;
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
