import React, { PureComponent } from 'react';
import { PopulatedTeamStreakWithClientData } from '@streakoid/streakoid-shared/lib/reducers/teamStreakReducer';
import { FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { NavigationState, NavigationParams, NavigationScreenProp, NavigationEvents } from 'react-navigation';
import { ListItem, Divider, Text } from 'react-native-elements';

import { Screens } from '../screens/Screens';
import { teamStreakActions } from '../actions/sharedActions';
import { Spacer } from './Spacer';

interface ArchivedTeamStreakListProps {
    getTeamStreak: typeof teamStreakActions.getSelectedTeamStreak;
    getArchivedTeamStreaks: typeof teamStreakActions.getArchivedTeamStreaks;
    archivedTeamStreaks: PopulatedTeamStreakWithClientData[];
    getMultipleArchivedTeamStreaksIsLoading: boolean;
}

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ArchivedTeamStreakListProps & NavigationProps;

class ArchivedTeamStreakList extends PureComponent<Props> {
    renderArchivedTeamStreakList(): JSX.Element {
        const { archivedTeamStreaks } = this.props;
        return (
            <FlatList
                data={archivedTeamStreaks}
                keyExtractor={(teamStreak: PopulatedTeamStreakWithClientData) => teamStreak._id}
                renderItem={({ item }) => {
                    const { _id, streakName, streakDescription } = item;
                    return (
                        <View>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate(Screens.TeamStreakInfo, {
                                        _id,
                                        streakName,
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
        );
    }

    render(): JSX.Element {
        const { archivedTeamStreaks, getArchivedTeamStreaks, getMultipleArchivedTeamStreaksIsLoading } = this.props;
        return (
            <>
                <NavigationEvents onWillFocus={() => getArchivedTeamStreaks()} />
                {archivedTeamStreaks.length === 0 && getMultipleArchivedTeamStreaksIsLoading ? (
                    <ActivityIndicator />
                ) : null}
                {archivedTeamStreaks.length === 0 && !getMultipleArchivedTeamStreaksIsLoading ? (
                    <>
                        <Spacer />
                        <Text>No Archived Team Streaks</Text>
                    </>
                ) : null}
                {this.renderArchivedTeamStreakList()}
            </>
        );
    }
}

export { ArchivedTeamStreakList };
