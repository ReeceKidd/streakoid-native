import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationState, NavigationParams, FlatList, NavigationEvents } from 'react-navigation';

import { AppState } from '../../store';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Spacer } from '../components/Spacer';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { leaderboardActions } from '../actions/sharedActions';
import { Screens } from './Screens';
import { ListItem, Divider, Text } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMedal } from '@fortawesome/pro-solid-svg-icons';
import { View, ActivityIndicator } from 'react-native';
import { NavigationLink } from '../components/NavigationLink';

const mapStateToProps = (state: AppState) => {
    const followingLeaderboard = state && state.leaderboards && state.leaderboards.followingLeaderboard;
    const getFollowingLeaderboardIsLoading =
        state && state.leaderboards && state.leaderboards.getFollowingLeaderboardIsLoading;
    const getFollowingLeaderboardErrorMessage =
        state && state.leaderboards && state.leaderboards.getFollowingLeaderboardErrorMessage;
    const followingIds =
        state && state.users && state.users.currentUser && state.users.currentUser.following.map((user) => user.userId);
    const currentUserId = state && state.users && state.users.currentUser && state.users.currentUser._id;
    return {
        followingLeaderboard,
        getFollowingLeaderboardIsLoading,
        getFollowingLeaderboardErrorMessage,
        followingIds: [...followingIds, currentUserId],
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getFollowingLeaderboard: bindActionCreators(leaderboardActions.getFollowingLeaderboard, dispatch),
});

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

class FollowingLeaderboardScreenComponent extends PureComponent<Props> {
    renderFollowingLeaderboard(): JSX.Element {
        const { followingLeaderboard } = this.props;
        return (
            <FlatList
                data={followingLeaderboard}
                keyExtractor={(user) => user._id}
                renderItem={({ item, index }) => {
                    const { _id, username, profileImages, totalStreakCompletes } = item;
                    const userProfileImage = profileImages.originalImageUrl;
                    return (
                        <>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate(Screens.UserProfile, {
                                        _id,
                                        username,
                                    })
                                }
                            >
                                <ListItem
                                    leftElement={<Text>#{index + 1}</Text>}
                                    leftAvatar={{
                                        source: { uri: userProfileImage },
                                    }}
                                    title={username}
                                    subtitle={
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>{`Streak completes: `}</Text>
                                            <Text style={{ fontWeight: 'bold' }}>{`${totalStreakCompletes}`}</Text>
                                        </View>
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
        const { getFollowingLeaderboard, followingIds, getFollowingLeaderboardIsLoading } = this.props;
        return (
            <ScrollView>
                <NavigationEvents
                    onWillFocus={() => {
                        getFollowingLeaderboard({ userIds: followingIds });
                    }}
                />
                <Spacer>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={{ fontWeight: 'bold' }}>
                            Following Leaderboard <FontAwesomeIcon icon={faMedal} />
                        </Text>
                        {getFollowingLeaderboardIsLoading ? <ActivityIndicator style={{ marginLeft: 10 }} /> : null}
                    </View>
                    {followingIds.length > 0 ? (
                        this.renderFollowingLeaderboard()
                    ) : (
                        <NavigationLink
                            navigation={this.props.navigation}
                            text="You're not following anyone yet. Follow someone."
                            screen={Screens.Users}
                        />
                    )}
                </Spacer>
            </ScrollView>
        );
    }
}

const FollowingLeaderboardScreen = connect(mapStateToProps, mapDispatchToProps)(FollowingLeaderboardScreenComponent);
export { FollowingLeaderboardScreen };
