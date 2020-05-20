import React, { PureComponent } from 'react';
import { SoloStreakListItem } from '@streakoid/streakoid-shared/lib/reducers/soloStreakReducer';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { NavigationState, NavigationParams, NavigationScreenProp, NavigationEvents } from 'react-navigation';
import { ListItem, Divider, Text } from 'react-native-elements';

import { SoloStreakTaskButton } from './SoloStreakTaskButton';
import { NavigationLink } from './NavigationLink';
import { Screens } from '../screens/Screens';
import { getStreakCompletionInfo } from '@streakoid/streakoid-shared/lib';
import { soloStreakActions } from '../actions/sharedActions';
import { StreakFlame } from './StreakFlame';

interface LiveSoloStreakListProps {
    userId: string;
    getSoloStreak: typeof soloStreakActions.getSoloStreak;
    getLiveSoloStreaks: typeof soloStreakActions.getLiveSoloStreaks;
    completeSoloStreakListTask: (soloStreakId: string) => void;
    incompleteSoloStreakListTask: (soloStreakId: string) => void;
    liveSoloStreaks: SoloStreakListItem[];
    getMultipleLiveSoloStreaksIsLoading: boolean;
    totalNumberOfSoloStreaks: number;
}

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = LiveSoloStreakListProps & NavigationProps;

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
        const {
            liveSoloStreaks,
            totalNumberOfSoloStreaks,
            getLiveSoloStreaks,
            userId,
            getMultipleLiveSoloStreaksIsLoading,
        } = this.props;
        return (
            <>
                <NavigationEvents
                    onWillFocus={() => {
                        if (userId) {
                            getLiveSoloStreaks();
                        }
                    }}
                />
                {totalNumberOfSoloStreaks === 0 && !getMultipleLiveSoloStreaksIsLoading ? (
                    <View style={{ marginTop: 5 }}>
                        <NavigationLink
                            navigation={this.props.navigation}
                            text="No solo streaks found. Add one"
                            screen={Screens.CreateSoloStreak}
                        />
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
