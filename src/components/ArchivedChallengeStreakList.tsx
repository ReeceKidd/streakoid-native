import React, { Component } from 'react';
import { ArchivedChallengeStreakListItem } from '@streakoid/streakoid-shared/lib/reducers/challengeStreakReducer';
import { FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { NavigationState, NavigationParams, NavigationScreenProp, NavigationEvents } from 'react-navigation';
import { ListItem, Divider, Text } from 'react-native-elements';

import { Screens } from '../screens/Screens';
import { challengeStreakActions } from '../actions/sharedActions';
import { Spacer } from './Spacer';

interface ArchivedChallengeStreakListProps {
    getArchivedChallengeStreaks: typeof challengeStreakActions.getArchivedChallengeStreaks;
    archivedChallengeStreaks: ArchivedChallengeStreakListItem[];
    getMultipleArchivedChallengeStreaksIsLoading: boolean;
}

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ArchivedChallengeStreakListProps & NavigationProps;

class ArchivedChallengeStreakList extends Component<Props> {
    renderArchivedChallengeStreakList(): JSX.Element {
        const { archivedChallengeStreaks } = this.props;
        return (
            <FlatList
                data={archivedChallengeStreaks}
                keyExtractor={(challengeStreak) => challengeStreak._id}
                renderItem={({ item }) => {
                    const { _id, challengeName, challengeDescription } = item;
                    return (
                        <View>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate(Screens.ChallengeStreakInfo, {
                                        _id,
                                        challengeName,
                                    })
                                }
                            >
                                <ListItem chevron title={challengeName} subtitle={challengeDescription} />
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
            archivedChallengeStreaks,
            getArchivedChallengeStreaks,
            getMultipleArchivedChallengeStreaksIsLoading,
        } = this.props;
        return (
            <>
                <NavigationEvents onWillFocus={() => getArchivedChallengeStreaks()} />
                {archivedChallengeStreaks.length === 0 && getMultipleArchivedChallengeStreaksIsLoading ? (
                    <ActivityIndicator />
                ) : null}
                {archivedChallengeStreaks.length === 0 && !getMultipleArchivedChallengeStreaksIsLoading ? (
                    <>
                        <Spacer />
                        <Text>No Archived Challenge Streaks</Text>
                    </>
                ) : null}
                {this.renderArchivedChallengeStreakList()}
            </>
        );
    }
}

export { ArchivedChallengeStreakList };
