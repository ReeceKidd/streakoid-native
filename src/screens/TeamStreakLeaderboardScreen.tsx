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
import { ListItem, Divider, Text, Avatar } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';

const mapStateToProps = (state: AppState) => {
    const teamStreakLeaderboard = state && state.leaderboards && state.leaderboards.teamStreakLeaderboard;
    const getTeamStreakLeaderboardIsLoading =
        state && state.leaderboards && state.leaderboards.getTeamStreakLeaderboardIsLoading;
    const getTeamStreakLeaderboardErrorMessage =
        state && state.leaderboards && state.leaderboards.getTeamStreakLeaderboardErrorMessage;
    return {
        teamStreakLeaderboard,
        getTeamStreakLeaderboardIsLoading,
        getTeamStreakLeaderboardErrorMessage,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getTeamStreaksLeaderboard: bindActionCreators(leaderboardActions.getTeamStreakLeaderboard, dispatch),
});

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

class TeamStreakLeaderboardScreenComponent extends Component<Props> {
    renderTeamStreakLeaderboard(): JSX.Element {
        const { teamStreakLeaderboard } = this.props;
        return (
            <FlatList
                data={teamStreakLeaderboard}
                keyExtractor={(teamStreakLeaderboardItem) => teamStreakLeaderboardItem.streakId}
                renderItem={({ item, index }) => {
                    const { currentStreakNumberOfDaysInARow, streakId, streakName, members } = item;
                    const maximumNumberOfTeamMembersToDisplay = 3;
                    return (
                        <>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate(Screens.TeamStreakInfo, {
                                        _id: streakId,
                                        streakName: streakName,
                                    })
                                }
                            >
                                <ListItem
                                    leftElement={<Text>#{index + 1}</Text>}
                                    rightElement={
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                            {members.length <= maximumNumberOfTeamMembersToDisplay ? (
                                                members.map((member) => {
                                                    return (
                                                        <Avatar
                                                            rounded
                                                            key={member._id}
                                                            source={{
                                                                uri: member.profileImage,
                                                            }}
                                                        />
                                                    );
                                                })
                                            ) : (
                                                <View style={{ flexDirection: 'row' }}>
                                                    {members
                                                        .slice(0, maximumNumberOfTeamMembersToDisplay)
                                                        .map((member) => {
                                                            return (
                                                                <Avatar
                                                                    rounded
                                                                    key={member._id}
                                                                    source={{
                                                                        uri: member.profileImage,
                                                                    }}
                                                                />
                                                            );
                                                        })}
                                                    <Text>+{members.length - maximumNumberOfTeamMembersToDisplay}</Text>
                                                </View>
                                            )}
                                        </View>
                                    }
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
        const { getTeamStreaksLeaderboard, getTeamStreakLeaderboardIsLoading } = this.props;
        return (
            <ScrollView>
                <NavigationEvents
                    onWillFocus={() => {
                        getTeamStreaksLeaderboard();
                    }}
                />
                <Spacer>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={{ fontWeight: 'bold' }}>
                            Team Streak Leaderboard <FontAwesome5 name="people-carry" size={20} />
                        </Text>
                        {getTeamStreakLeaderboardIsLoading ? <ActivityIndicator style={{ marginLeft: 10 }} /> : null}
                    </View>
                    {this.renderTeamStreakLeaderboard()}
                </Spacer>
            </ScrollView>
        );
    }
}

const TeamStreakLeaderboardScreen = connect(mapStateToProps, mapDispatchToProps)(TeamStreakLeaderboardScreenComponent);
export { TeamStreakLeaderboardScreen };
