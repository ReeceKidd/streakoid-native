import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationState, NavigationParams, FlatList, NavigationEvents } from 'react-navigation';

import { AppState } from '../../store';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Spacer } from '../../components/Spacer';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { leaderboardActions } from '../../actions/sharedActions';
import { Screens } from './Screens';
import { ListItem, Divider, Text } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';

const mapStateToProps = (state: AppState) => {
    const soloStreakLeaderboard = state && state.leaderboards && state.leaderboards.soloStreakLeaderboard;
    const getSoloStreakLeaderboardIsLoading =
        state && state.leaderboards && state.leaderboards.getSoloStreakLeaderboardIsLoading;
    const getSoloStreakLeaderboardErrorMessage =
        state && state.leaderboards && state.leaderboards.getSoloStreakLeaderboardErrorMessage;
    return {
        soloStreakLeaderboard,
        getSoloStreakLeaderboardIsLoading,
        getSoloStreakLeaderboardErrorMessage,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getSoloStreaksLeaderboard: bindActionCreators(leaderboardActions.getSoloStreakLeaderboard, dispatch),
});

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

class SoloStreakLeaderboardScreenComponent extends Component<Props> {
    renderSoloStreakLeaderboard(): JSX.Element {
        const { soloStreakLeaderboard } = this.props;
        return (
            <FlatList
                data={soloStreakLeaderboard}
                keyExtractor={(soloStreakLeaderboardItem) => soloStreakLeaderboardItem.streakId}
                renderItem={({ item, index }) => {
                    const { currentStreakNumberOfDaysInARow, streakId, streakName, userProfileImage } = item;
                    return (
                        <>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate(Screens.SoloStreakInfo, {
                                        _id: streakId,
                                        streakName: streakName,
                                    })
                                }
                            >
                                <ListItem
                                    leftElement={<Text>#{index + 1}</Text>}
                                    leftAvatar={{
                                        source: { uri: userProfileImage },
                                    }}
                                    title={streakName}
                                    subtitle={
                                        currentStreakNumberOfDaysInARow !== 1
                                            ? `${currentStreakNumberOfDaysInARow.toString()} days`
                                            : `${currentStreakNumberOfDaysInARow.toString()} day`
                                    }
                                />
                            </TouchableOpacity>
                            <Divider />
                        </>
                    );
                }}
            />
        );
    }

    render(): JSX.Element | null {
        const { getSoloStreaksLeaderboard, getSoloStreakLeaderboardIsLoading } = this.props;
        return (
            <ScrollView>
                <NavigationEvents
                    onWillFocus={() => {
                        getSoloStreaksLeaderboard();
                    }}
                />
                <Spacer>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                            Solo Streak Leaderboard <FontAwesome5 name="child" size={20} />
                        </Text>
                        {getSoloStreakLeaderboardIsLoading ? <ActivityIndicator style={{ marginLeft: 10 }} /> : null}
                    </View>
                    {this.renderSoloStreakLeaderboard()}
                </Spacer>
            </ScrollView>
        );
    }
}

const SoloStreakLeaderboardScreen = connect(mapStateToProps, mapDispatchToProps)(SoloStreakLeaderboardScreenComponent);
export { SoloStreakLeaderboardScreen };
