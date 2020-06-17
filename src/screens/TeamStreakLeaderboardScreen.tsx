import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../store';
import { ScrollView, TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import { Spacer } from '../components/Spacer';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { leaderboardActions } from '../actions/authenticatedSharedActions';
import { Screens } from './Screens';
import { ListItem, Divider, Text, Avatar } from 'react-native-elements';
import { View, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPeopleCarry } from '@fortawesome/pro-solid-svg-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../screenNavigation/RootNavigator';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    const teamStreakLeaderboard = state && state.leaderboards && state.leaderboards.teamStreakLeaderboard;
    const getTeamStreakLeaderboardIsLoading =
        state && state.leaderboards && state.leaderboards.getTeamStreakLeaderboardIsLoading;
    const getTeamStreakLeaderboardErrorMessage =
        state && state.leaderboards && state.leaderboards.getTeamStreakLeaderboardErrorMessage;
    return {
        currentUser,
        teamStreakLeaderboard,
        getTeamStreakLeaderboardIsLoading,
        getTeamStreakLeaderboardErrorMessage,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getTeamStreaksLeaderboard: bindActionCreators(leaderboardActions.getTeamStreakLeaderboard, dispatch),
});

type TeamStreakLeaderboardScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.TeamStreakLeaderboard>;
type TeamStreakLeaderboardScreenRouteProp = RouteProp<RootStackParamList, Screens.TeamStreakLeaderboard>;

type NavigationProps = {
    navigation: TeamStreakLeaderboardScreenNavigationProp;
    route: TeamStreakLeaderboardScreenRouteProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

class TeamStreakLeaderboardScreenComponent extends PureComponent<Props> {
    componentDidMount() {
        this.props.getTeamStreaksLeaderboard();
    }
    renderTeamStreakLeaderboard(): JSX.Element {
        const { teamStreakLeaderboard, currentUser } = this.props;
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
                                        userIsApartOfStreak: Boolean(
                                            item.members.find((user) => user._id === currentUser._id),
                                        ),
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
        const { getTeamStreakLeaderboardIsLoading } = this.props;
        return (
            <ScrollView>
                <Spacer>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={{ fontWeight: 'bold' }}>
                            Team Streak Leaderboard <FontAwesomeIcon icon={faPeopleCarry} />
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
