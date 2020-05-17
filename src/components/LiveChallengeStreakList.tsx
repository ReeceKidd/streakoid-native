import React, { PureComponent } from 'react';
import { ChallengeStreakListItem } from '@streakoid/streakoid-shared/lib/reducers/challengeStreakReducer';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { NavigationState, NavigationParams, NavigationScreenProp, NavigationEvents } from 'react-navigation';
import { ListItem, Divider, Text } from 'react-native-elements';

import { ChallengeStreakTaskButton } from './ChallengeStreakTaskButton';
import { NavigationLink } from './NavigationLink';
import { Screens } from '../screens/Screens';
import { challengeStreakActions } from '../actions/sharedActions';
import { getStreakCompletionString } from '@streakoid/streakoid-shared/lib';
import { Spacer } from './Spacer';

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
    componentDidUpdate(prevProps: Props) {
        const { userId, getLiveChallengeStreaks } = this.props;
        if (prevProps.navigation.isFocused() !== this.props.navigation.isFocused()) {
            if (userId) {
                getLiveChallengeStreaks();
            }
        }
    }
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
                    const streakCompletionString = getStreakCompletionString({
                        pastStreaks: pastStreaks,
                        currentStreak: currentStreak,
                        timezone: timezone,
                        createdAt: new Date(createdAt),
                    });
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
                                            streakId={_id}
                                            completedToday={completedToday}
                                            incompleteChallengeStreakListTaskIsLoading={
                                                incompleteChallengeStreakListTaskIsLoading
                                            }
                                            completeChallengeStreakListTaskIsLoading={
                                                completeChallengeStreakListTaskIsLoading
                                            }
                                        />
                                    }
                                    title={item.challengeName}
                                    subtitle={streakCompletionString.string}
                                    subtitleStyle={{ color: streakCompletionString.error ? 'red' : 'green' }}
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
