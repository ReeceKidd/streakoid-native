import React, { PureComponent } from 'react';
import { ArchivedSoloStreakListItem } from '@streakoid/streakoid-shared/lib/reducers/soloStreakReducer';
import { FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { NavigationState, NavigationParams, NavigationScreenProp, NavigationEvents } from 'react-navigation';
import { ListItem, Divider, Text } from 'react-native-elements';

import { Screens } from '../screens/Screens';
import { soloStreakActions } from '../actions/sharedActions';
import { Spacer } from './Spacer';

interface ArchivedSoloStreakListProps {
    getArchivedSoloStreaks: typeof soloStreakActions.getArchivedSoloStreaks;
    archivedSoloStreaks: ArchivedSoloStreakListItem[];
    getMultipleArchivedSoloStreaksIsLoading: boolean;
}

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ArchivedSoloStreakListProps & NavigationProps;

class ArchivedSoloStreakList extends PureComponent<Props> {
    renderArchivedSoloStreakList(): JSX.Element {
        const { archivedSoloStreaks } = this.props;
        return (
            <FlatList
                data={archivedSoloStreaks}
                keyExtractor={(soloStreak: ArchivedSoloStreakListItem) => soloStreak._id}
                renderItem={({ item }) => {
                    const { _id, streakName, streakDescription } = item;
                    return (
                        <View>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate(Screens.SoloStreakInfo, {
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
        const { archivedSoloStreaks, getArchivedSoloStreaks, getMultipleArchivedSoloStreaksIsLoading } = this.props;
        return (
            <>
                <NavigationEvents onWillFocus={() => getArchivedSoloStreaks()} />
                {archivedSoloStreaks.length === 0 && getMultipleArchivedSoloStreaksIsLoading ? (
                    <ActivityIndicator />
                ) : null}
                {archivedSoloStreaks.length === 0 && !getMultipleArchivedSoloStreaksIsLoading ? (
                    <>
                        <Spacer />
                        <Text>No Archived Solo Streaks</Text>
                    </>
                ) : null}
                {this.renderArchivedSoloStreakList()}
            </>
        );
    }
}

export { ArchivedSoloStreakList };
