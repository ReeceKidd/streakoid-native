import React from 'react';
import { ArchivedChallengeStreakListItem } from '@streakoid/streakoid-shared/lib/reducers/challengeStreakReducer';
import { FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { ListItem, Divider, Text } from 'react-native-elements';
import { NavigationService } from '../../NavigationService';
import { Screens } from '../screens/Screens';
import { Spacer } from './Spacer';

interface ArchivedChallengeStreakListProps {
    archivedChallengeStreaks: ArchivedChallengeStreakListItem[];
    getMultipleArchivedChallengeStreaksIsLoading: boolean;
}

type Props = ArchivedChallengeStreakListProps;

const ArchivedChallengeStreakList = (props: Props) => {
    const { archivedChallengeStreaks, getMultipleArchivedChallengeStreaksIsLoading } = props;
    return (
        <>
            {archivedChallengeStreaks.length === 0 && getMultipleArchivedChallengeStreaksIsLoading ? (
                <ActivityIndicator />
            ) : null}
            {archivedChallengeStreaks.length === 0 && !getMultipleArchivedChallengeStreaksIsLoading ? (
                <>
                    <Spacer />
                    <Text>No Archived Challenge Streaks</Text>
                </>
            ) : null}
            <FlatList
                data={archivedChallengeStreaks}
                keyExtractor={(challengeStreak) => challengeStreak._id}
                renderItem={({ item }) => {
                    const { _id, challengeName, challengeDescription } = item;
                    return (
                        <View>
                            <TouchableOpacity
                                onPress={() =>
                                    NavigationService.navigate({
                                        screen: Screens.ChallengeStreakInfo,
                                        params: {
                                            _id,
                                            challengeName,
                                        },
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
        </>
    );
};

export { ArchivedChallengeStreakList };
