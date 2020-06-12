import React from 'react';
import { ArchivedSoloStreakListItem } from '@streakoid/streakoid-shared/lib/reducers/soloStreakReducer';
import { FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { ListItem, Divider, Text } from 'react-native-elements';

import { Screens } from '../screens/Screens';
import { Spacer } from './Spacer';
import { NavigationService } from '../../NavigationService';

interface ArchivedSoloStreakListProps {
    archivedSoloStreaks: ArchivedSoloStreakListItem[];
    getMultipleArchivedSoloStreaksIsLoading: boolean;
}

type Props = ArchivedSoloStreakListProps;

const ArchivedSoloStreakList = (props: Props) => {
    const { archivedSoloStreaks, getMultipleArchivedSoloStreaksIsLoading } = props;
    return (
        <>
            {archivedSoloStreaks.length === 0 && getMultipleArchivedSoloStreaksIsLoading ? <ActivityIndicator /> : null}
            {archivedSoloStreaks.length === 0 && !getMultipleArchivedSoloStreaksIsLoading ? (
                <>
                    <Spacer />
                    <Text>No Archived Solo Streaks</Text>
                </>
            ) : null}
            <FlatList
                data={archivedSoloStreaks}
                keyExtractor={(soloStreak: ArchivedSoloStreakListItem) => soloStreak._id}
                renderItem={({ item }) => {
                    const { _id, streakName, streakDescription } = item;
                    return (
                        <View>
                            <TouchableOpacity
                                onPress={() =>
                                    NavigationService.navigate({
                                        screen: Screens.SoloStreakInfo,
                                        params: {
                                            _id,
                                            streakName,
                                        },
                                    })
                                }
                            >
                                <ListItem chevron title={streakName} subtitle={streakDescription} />
                            </TouchableOpacity>
                            <Divider />
                        </View>
                    );
                }}
            />
        </>
    );
};

export { ArchivedSoloStreakList };
