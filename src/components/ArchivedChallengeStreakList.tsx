import React from 'react';
import { ArchivedChallengeStreakListItem } from '@streakoid/streakoid-shared/lib/reducers/challengeStreakReducer';
import { FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { ListItem, Divider, Text } from 'react-native-elements';
import { Screens } from '../screens/Screens';
import { Spacer } from './Spacer';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';

interface ArchivedChallengeStreakListProps {
    navigation: StackNavigationProp<RootStackParamList>;
    archivedChallengeStreaks: ArchivedChallengeStreakListItem[];
    getMultipleArchivedChallengeStreaksIsLoading: boolean;
}

type Props = ArchivedChallengeStreakListProps;

const ArchivedChallengeStreakList = (props: Props) => {
    const { navigation, archivedChallengeStreaks, getMultipleArchivedChallengeStreaksIsLoading } = props;
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
                                    navigation.navigate(Screens.ChallengeStreakInfo, {
                                        _id,
                                        streakName: challengeName,
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
