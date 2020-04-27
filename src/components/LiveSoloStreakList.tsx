import React, { Component } from 'react';
import { SoloStreakListItem } from '@streakoid/streakoid-shared/lib/reducers/soloStreakReducer';
import { FlatList, TouchableOpacity } from 'react-native';
import { NavigationState, NavigationParams, NavigationScreenProp, NavigationEvents } from 'react-navigation';
import { ListItem, Divider, Text } from 'react-native-elements';

import { SoloStreakTaskButton } from './SoloStreakTaskButton';
import { NavigationLink } from './NavigationLink';
import { Screens } from '../screens/Screens';
import { getStreakCompletionString } from '@streakoid/streakoid-shared/lib';
import { soloStreakActions } from '../actions/sharedActions';
import { Spacer } from './Spacer';

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

class LiveSoloStreakList extends Component<Props> {
    componentDidUpdate(prevProps: Props) {
        const { userId, getLiveSoloStreaks } = this.props;
        if (prevProps.navigation.isFocused() !== this.props.navigation.isFocused()) {
            if (userId) {
                getLiveSoloStreaks();
            }
        }
    }
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
                    const streakCompletionString = getStreakCompletionString({
                        pastStreaks,
                        currentStreak,
                        timezone,
                        createdAt: new Date(createdAt),
                    });
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
                                            streakId={_id}
                                            completedToday={completedToday}
                                            incompleteSoloStreakListTaskIsLoading={
                                                incompleteSoloStreakListTaskIsLoading
                                            }
                                            completeSoloStreakListTaskIsLoading={completeSoloStreakListTaskIsLoading}
                                        />
                                    }
                                    title={item.streakName}
                                    subtitle={streakCompletionString.string}
                                    subtitleStyle={{ color: streakCompletionString.error ? 'red' : 'green' }}
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
                    <NavigationLink
                        navigation={this.props.navigation}
                        text="No solo streaks found. Add one"
                        screen={Screens.CreateSoloStreak}
                    />
                ) : null}
                {totalNumberOfSoloStreaks > 0 && liveSoloStreaks.length === 0 ? (
                    <Spacer>
                        <Text style={{ color: '#4caf50' }}>All done for today</Text>
                    </Spacer>
                ) : null}
                {this.renderSoloStreakList()}
            </>
        );
    }
}

export { LiveSoloStreakList };
