import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, ListItem, Avatar, Button } from 'react-native-elements';
import { Spacer } from '../components/Spacer';
import { AppState, AppActions, getStreakCompletionInfo } from '@streakoid/streakoid-shared/lib';
import { userActions } from '../actions/authenticatedSharedActions';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { LoadingScreenSpinner } from '../components/LoadingScreenSpinner';
import { Screens } from './Screens';
import { GeneralActivityFeed } from '../components/GeneralActivityFeed';
import { faChild, faPeopleCarry, faMedal, faUser } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { SoloStreak } from '@streakoid/streakoid-models/lib/Models/SoloStreak';
import { PopulatedTeamStreak } from '@streakoid/streakoid-models/lib/Models/PopulatedTeamStreak';
import { ChallengeStreak } from '@streakoid/streakoid-models/lib/Models/ChallengeStreak';
import { StreakFlame } from '../components/StreakFlame';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../StackNavigator';
import { ScrollView, FlatList } from 'react-native-gesture-handler';

const mapStateToProps = (state: AppState) => {
    const selectedUser = state && state.users && state.users.selectedUser;
    const getUserIsLoading = state && state.users && state.users.getUserIsLoading;
    const currentUser = state && state.users && state.users.currentUser;
    return {
        selectedUser,
        getUserIsLoading,
        currentUser,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getUser: bindActionCreators(userActions.getUser, dispatch),
    clearSelectedUser: bindActionCreators(userActions.clearSelectedUser, dispatch),
    followSelectedUser: bindActionCreators(userActions.followSelectedUser, dispatch),
    unfollowSelectedUser: bindActionCreators(userActions.unfollowSelectedUser, dispatch),
});

type UserProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.UserProfile>;
type UserProfileScreenRouteProp = RouteProp<RootStackParamList, Screens.UserProfile>;

type NavigationProps = {
    navigation: UserProfileScreenNavigationProp;
    route: UserProfileScreenRouteProp;
};
type Props = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    NavigationProps & { isFocused: boolean };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 50,
    },
});

class UserProfileScreenComponent extends PureComponent<Props> {
    componentDidMount() {
        const username = this.props.route.params.username;
        this.props.getUser({ username });
    }

    componentDidUpdate(prevProps: Props) {
        const previousUsername = prevProps.route.params.username;
        const newUsername = this.props.route.params.username;
        if (previousUsername !== newUsername) {
            this.props.getUser({ username: newUsername });
        }
    }

    render(): JSX.Element {
        const { selectedUser, getUserIsLoading, currentUser } = this.props;
        const profileImage = selectedUser.profileImages.originalImageUrl;
        const { soloStreaks, teamStreaks, challengeStreaks } = selectedUser;
        return (
            <ScrollView style={styles.container}>
                {getUserIsLoading ? (
                    <Spacer>
                        <LoadingScreenSpinner />
                    </Spacer>
                ) : (
                    <>
                        <Spacer>
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Avatar
                                    renderPlaceholderContent={<ActivityIndicator />}
                                    source={{ uri: profileImage }}
                                    size="large"
                                    rounded
                                />
                            </View>
                        </Spacer>
                        <Spacer>
                            {!selectedUser.isCurrentUserFollowing && selectedUser._id != currentUser._id ? (
                                <Button
                                    loading={selectedUser.followUserIsLoading}
                                    title="Follow"
                                    type="outline"
                                    onPress={() =>
                                        this.props.followSelectedUser({
                                            userId: selectedUser._id,
                                            username: selectedUser.username,
                                            profileImage,
                                        })
                                    }
                                />
                            ) : (
                                <Button
                                    loading={selectedUser.unfollowUserIsLoading}
                                    title="Unfollow"
                                    type="outline"
                                    onPress={() => this.props.unfollowSelectedUser(selectedUser._id)}
                                />
                            )}
                        </Spacer>

                        <Spacer>
                            <Text style={{ fontWeight: 'bold' }}>
                                Solo Streaks <FontAwesomeIcon icon={faChild} />
                                {selectedUser.soloStreaks.length}
                            </Text>
                            {soloStreaks.length > 0 ? (
                                <ScrollView>
                                    <FlatList
                                        data={soloStreaks}
                                        keyExtractor={(soloStreak: SoloStreak) => soloStreak._id}
                                        renderItem={({ item }) => {
                                            const { pastStreaks, currentStreak, timezone, createdAt } = item;
                                            const streakCompletionInfo = getStreakCompletionInfo({
                                                pastStreaks,
                                                currentStreak,
                                                timezone,
                                                createdAt: new Date(createdAt),
                                            });
                                            const daysSinceUserCompletedStreak =
                                                streakCompletionInfo &&
                                                streakCompletionInfo.daysSinceUserCompletedStreak;
                                            const daysSinceUserCreatedStreak =
                                                streakCompletionInfo && streakCompletionInfo.daysSinceUserCreatedStreak;
                                            const negativeDayStreak =
                                                daysSinceUserCompletedStreak || daysSinceUserCreatedStreak || 0;
                                            return (
                                                <View>
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            this.props.navigation.navigate(Screens.SoloStreakInfo, {
                                                                _id: item._id,
                                                                streakName: item.streakName,
                                                                isUsersStreak: item.userId === currentUser._id,
                                                            })
                                                        }
                                                    >
                                                        <ListItem
                                                            title={item.streakName}
                                                            rightElement={
                                                                <StreakFlame
                                                                    currentStreakNumberOfDaysInARow={
                                                                        currentStreak.numberOfDaysInARow
                                                                    }
                                                                    negativeDayStreak={negativeDayStreak}
                                                                />
                                                            }
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            );
                                        }}
                                    />
                                </ScrollView>
                            ) : (
                                <Text style={{ color: 'red' }}>{`${selectedUser.username} has no solo streaks`}</Text>
                            )}
                        </Spacer>
                        <Spacer>
                            <Text style={{ fontWeight: 'bold' }}>
                                Team Streaks <FontAwesomeIcon icon={faPeopleCarry} />
                                {selectedUser.teamStreaks.length}
                            </Text>
                            {teamStreaks.length > 0 ? (
                                <ScrollView>
                                    <FlatList
                                        data={teamStreaks}
                                        keyExtractor={(teamStreak: PopulatedTeamStreak) => teamStreak._id}
                                        renderItem={({ item }) => {
                                            const { _id, streakName, members } = item;
                                            const maximumNumberOfTeamMembersToDisplay = 3;
                                            const { pastStreaks, currentStreak, timezone, createdAt } = item;
                                            const streakCompletionInfo = getStreakCompletionInfo({
                                                pastStreaks,
                                                currentStreak,
                                                timezone,
                                                createdAt: new Date(createdAt),
                                            });
                                            const daysSinceUserCompletedStreak =
                                                streakCompletionInfo &&
                                                streakCompletionInfo.daysSinceUserCompletedStreak;
                                            const daysSinceUserCreatedStreak =
                                                streakCompletionInfo && streakCompletionInfo.daysSinceUserCreatedStreak;
                                            const negativeDayStreak =
                                                daysSinceUserCompletedStreak || daysSinceUserCreatedStreak || 0;
                                            return (
                                                <View>
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            this.props.navigation.navigate(Screens.TeamStreakInfo, {
                                                                _id,
                                                                streakName,
                                                                userIsApartOfStreak: Boolean(
                                                                    item.members.find(
                                                                        (user) => user._id === currentUser._id,
                                                                    ),
                                                                ),
                                                            })
                                                        }
                                                    >
                                                        <ListItem
                                                            title={streakName}
                                                            subtitle={
                                                                <StreakFlame
                                                                    currentStreakNumberOfDaysInARow={
                                                                        currentStreak.numberOfDaysInARow
                                                                    }
                                                                    negativeDayStreak={negativeDayStreak}
                                                                />
                                                            }
                                                            rightElement={
                                                                <View
                                                                    style={{
                                                                        flexDirection: 'row',
                                                                        justifyContent: 'flex-start',
                                                                    }}
                                                                >
                                                                    {members.length <=
                                                                    maximumNumberOfTeamMembersToDisplay ? (
                                                                        members.map((member) => {
                                                                            return (
                                                                                <Avatar
                                                                                    renderPlaceholderContent={
                                                                                        <ActivityIndicator />
                                                                                    }
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
                                                                                .slice(
                                                                                    0,
                                                                                    maximumNumberOfTeamMembersToDisplay,
                                                                                )
                                                                                .map((member) => {
                                                                                    return (
                                                                                        <Avatar
                                                                                            renderPlaceholderContent={
                                                                                                <ActivityIndicator />
                                                                                            }
                                                                                            rounded
                                                                                            key={member._id}
                                                                                            source={{
                                                                                                uri:
                                                                                                    member.profileImage,
                                                                                            }}
                                                                                        />
                                                                                    );
                                                                                })}
                                                                            <Text>
                                                                                +
                                                                                {members.length -
                                                                                    maximumNumberOfTeamMembersToDisplay}
                                                                            </Text>
                                                                        </View>
                                                                    )}
                                                                </View>
                                                            }
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            );
                                        }}
                                    />
                                </ScrollView>
                            ) : (
                                <Text style={{ color: 'red' }}>{`${selectedUser.username} has no team streaks`}</Text>
                            )}
                        </Spacer>
                        <Spacer>
                            <Text style={{ fontWeight: 'bold' }}>
                                Challenge Streaks <FontAwesomeIcon icon={faMedal} />
                                {selectedUser.challengeStreaks.length}
                            </Text>
                            {challengeStreaks.length > 0 ? (
                                <ScrollView>
                                    <FlatList
                                        data={challengeStreaks}
                                        keyExtractor={(teamStreak: ChallengeStreak) => teamStreak._id}
                                        renderItem={({ item }) => {
                                            const { pastStreaks, currentStreak, timezone, createdAt } = item;
                                            const streakCompletionInfo = getStreakCompletionInfo({
                                                pastStreaks,
                                                currentStreak,
                                                timezone,
                                                createdAt: new Date(createdAt),
                                            });
                                            const daysSinceUserCompletedStreak =
                                                streakCompletionInfo &&
                                                streakCompletionInfo.daysSinceUserCompletedStreak;
                                            const daysSinceUserCreatedStreak =
                                                streakCompletionInfo && streakCompletionInfo.daysSinceUserCreatedStreak;
                                            const negativeDayStreak =
                                                daysSinceUserCompletedStreak || daysSinceUserCreatedStreak || 0;
                                            return (
                                                <View>
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            this.props.navigation.navigate(Screens.UserProfile, {
                                                                _id: item._id,
                                                                username: item.username,
                                                            })
                                                        }
                                                    >
                                                        <ListItem
                                                            title={item.challengeName}
                                                            rightElement={
                                                                <StreakFlame
                                                                    currentStreakNumberOfDaysInARow={
                                                                        currentStreak.numberOfDaysInARow
                                                                    }
                                                                    negativeDayStreak={negativeDayStreak}
                                                                />
                                                            }
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            );
                                        }}
                                    />
                                </ScrollView>
                            ) : (
                                <Text
                                    style={{ color: 'red' }}
                                >{`${selectedUser.username} has no challenge streaks`}</Text>
                            )}
                        </Spacer>
                        <Spacer>
                            <Text style={{ fontWeight: 'bold' }}>
                                Following <FontAwesomeIcon icon={faUser} /> {selectedUser.following.length}
                            </Text>
                            {selectedUser && selectedUser.following && selectedUser.following.length > 0 ? (
                                <FlatList
                                    data={selectedUser.following}
                                    keyExtractor={(following) => following.userId}
                                    renderItem={({ item }) => {
                                        return (
                                            <>
                                                <View>
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            this.props.navigation.navigate(Screens.UserProfile, {
                                                                username: item.username,
                                                                _id: item.userId,
                                                            })
                                                        }
                                                    >
                                                        <ListItem
                                                            leftAvatar={{ source: { uri: item.profileImage } }}
                                                            title={item.username}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        );
                                    }}
                                />
                            ) : (
                                <>
                                    <Spacer />
                                    <Text> {`${selectedUser.username} is not following anyone`}</Text>
                                </>
                            )}
                        </Spacer>
                        <Spacer>
                            <Text style={{ fontWeight: 'bold' }}>
                                Followers <FontAwesomeIcon icon={faUser} /> {selectedUser.followers.length}
                            </Text>
                            {selectedUser && selectedUser.followers && selectedUser.followers.length > 0 ? (
                                <FlatList
                                    data={selectedUser.followers}
                                    keyExtractor={(following) => following.userId}
                                    renderItem={({ item }) => {
                                        return (
                                            <>
                                                <View>
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            this.props.navigation.navigate(Screens.UserProfile, {
                                                                username: item.username,
                                                                _id: item.userId,
                                                            })
                                                        }
                                                    >
                                                        <ListItem
                                                            leftAvatar={{ source: { uri: item.profileImage } }}
                                                            title={item.username}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        );
                                    }}
                                />
                            ) : (
                                <>
                                    <Spacer />
                                    <Text> {`${selectedUser.username} has no followers yet`}</Text>
                                </>
                            )}
                        </Spacer>
                        <Spacer>
                            <Text style={{ fontWeight: 'bold' }}>Achievements</Text>
                            <Text />
                            {selectedUser && selectedUser.achievements && selectedUser.achievements.length > 0 ? (
                                <FlatList
                                    data={selectedUser.achievements}
                                    keyExtractor={(achievement) => achievement._id}
                                    renderItem={({ item }) => {
                                        return (
                                            <>
                                                <View>
                                                    <ListItem title={item.name} subtitle={item.description} />
                                                </View>
                                            </>
                                        );
                                    }}
                                />
                            ) : (
                                <>
                                    <Spacer />
                                    <Text>{`${selectedUser.username} has no achievements yet.`}</Text>
                                </>
                            )}
                        </Spacer>
                        <Spacer>
                            <Text style={{ fontWeight: 'bold' }}>Activity Feed</Text>
                            <GeneralActivityFeed
                                activityFeedItems={
                                    selectedUser &&
                                    selectedUser.activityFeed &&
                                    selectedUser.activityFeed.activityFeedItems
                                }
                            />
                        </Spacer>
                        <View />
                    </>
                )}
            </ScrollView>
        );
    }
}

const UserProfileScreen = connect(mapStateToProps, mapDispatchToProps)(UserProfileScreenComponent);

export { UserProfileScreen };
