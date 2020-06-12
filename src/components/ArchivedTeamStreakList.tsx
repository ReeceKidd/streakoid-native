import React from 'react';
import { PopulatedTeamStreakWithClientData } from '@streakoid/streakoid-shared/lib/reducers/teamStreakReducer';
import { FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { ListItem, Divider, Text } from 'react-native-elements';

import { Screens } from '../screens/Screens';
import { teamStreakActions } from '../actions/authenticatedSharedActions';
import { Spacer } from './Spacer';
import { NavigationService } from '../../NavigationService';

interface ArchivedTeamStreakListProps {
    getTeamStreak: typeof teamStreakActions.getSelectedTeamStreak;
    getArchivedTeamStreaks: typeof teamStreakActions.getArchivedTeamStreaks;
    archivedTeamStreaks: PopulatedTeamStreakWithClientData[];
    getMultipleArchivedTeamStreaksIsLoading: boolean;
}

type Props = ArchivedTeamStreakListProps;

const ArchivedTeamStreakList = (props: Props) => {
    const { archivedTeamStreaks, getMultipleArchivedTeamStreaksIsLoading } = props;
    return (
        <>
            {archivedTeamStreaks.length === 0 && getMultipleArchivedTeamStreaksIsLoading ? <ActivityIndicator /> : null}
            {archivedTeamStreaks.length === 0 && !getMultipleArchivedTeamStreaksIsLoading ? (
                <>
                    <Spacer />
                    <Text>No Archived Team Streaks</Text>
                </>
            ) : null}
            <FlatList
                data={archivedTeamStreaks}
                keyExtractor={(teamStreak: PopulatedTeamStreakWithClientData) => teamStreak._id}
                renderItem={({ item }) => {
                    const { _id, streakName, streakDescription } = item;
                    return (
                        <View>
                            <TouchableOpacity
                                onPress={() =>
                                    NavigationService.navigate({
                                        screen: Screens.TeamStreakInfo,
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

export { ArchivedTeamStreakList };
