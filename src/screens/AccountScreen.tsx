import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

import { AppState } from '../../store';
import { Button, Avatar, Text, ListItem } from 'react-native-elements';
import { Spacer } from '../components/Spacer';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { userActions } from '../actions/authenticatedSharedActions';
import { authActions } from '../actions/authActions';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/pro-solid-svg-icons';
import { NotificationOptions } from '../components/NotificationOptions';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Screens } from './Screens';
import { NavigationLink } from '../components/NavigationLink';
import { GeneralActivityFeed } from '../components/GeneralActivityFeed';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AccountStrengthProgressBar } from '../components/AccountStrengthProgressBar';
import { getAccountCompletionPercentage } from '../helpers/getAccountCompletionPercentage';
import { RootStackParamList } from '../screenNavigation/RootNavigator';

const mapStateToProps = (state: AppState) => {
    const selectedUser = state && state.users && state.users.selectedUser;
    const currentUser = state && state.users && state.users.currentUser;
    const getCurrentUserErrorMessage = state && state.users && state.users.getCurrentUserErrorMessage;
    const getCurrentUserIsLoading = state && state.users && state.users.getCurrentUserIsLoading;
    const liveChallengeStreaks = state && state.challengeStreaks && state.challengeStreaks.liveChallengeStreaks;
    const getLiveChallengeStreaksIsLoading =
        state && state.challengeStreaks && state.challengeStreaks.getMultipleLiveChallengeStreaksIsLoading;
    const updatePushNotificationsIsLoading =
        state && state.users && state.users.currentUser.updatePushNotificationsIsLoading;
    const updatePushNotificationsErrorMessage =
        state && state.users && state.users.currentUser.updatePushNotificationsErrorMessage;
    return {
        selectedUser,
        currentUser,
        getCurrentUserErrorMessage,
        getCurrentUserIsLoading,
        liveChallengeStreaks,
        getLiveChallengeStreaksIsLoading,
        updatePushNotificationsIsLoading,
        updatePushNotificationsErrorMessage,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    logoutUser: bindActionCreators(authActions.logoutUser, dispatch),
    getCurrentUser: bindActionCreators(userActions.getCurrentUser, dispatch),
    updateCurrentUser: bindActionCreators(userActions.updateCurrentUser, dispatch),
    unfollowUsersListUser: bindActionCreators(userActions.unfollowUsersListUser, dispatch),
    updateCurrentUserPushNotifications: bindActionCreators(userActions.updateCurrentUserPushNotifications, dispatch),
});

type AccountScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.Account>;
type AccountScreenRouteProp = RouteProp<RootStackParamList, Screens.Account>;

type NavigationProps = {
    navigation: AccountScreenNavigationProp;
    route: AccountScreenRouteProp;
};

type Props = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    NavigationProps & { isFocused: boolean };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class AccountScreenComponent extends React.PureComponent<Props> {
    componentDidMount() {
        this.props.getCurrentUser();
        this.props.navigation.setParams({
            username: this.props.currentUser.username || '',
        });
    }

    render(): JSX.Element {
        const {
            logoutUser,
            updateCurrentUserPushNotifications,
            currentUser,
            updatePushNotificationsIsLoading,
            updatePushNotificationsErrorMessage,
        } = this.props;
        const profileImage = currentUser && currentUser.profileImages.originalImageUrl;
        return (
            <ScrollView style={styles.container}>
                <View>
                    <Spacer>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Avatar
                                renderPlaceholderContent={<ActivityIndicator />}
                                source={{ uri: profileImage }}
                                size="large"
                                rounded
                            />
                        </View>
                    </Spacer>
                    <Spacer>
                        <Text h2>{currentUser.firstName}</Text>
                        <Text h2>{currentUser.lastName}</Text>
                    </Spacer>
                    {getAccountCompletionPercentage({ currentUser }) < 100 ? (
                        <View style={{ marginTop: 5, marginLeft: 15 }}>
                            <Text
                                onPress={() => this.props.navigation.navigate(Screens.WhatIsYourFirstName)}
                                style={{ color: 'blue' }}
                            >{`Improve your account strength`}</Text>
                        </View>
                    ) : null}
                    <AccountStrengthProgressBar currentUser={currentUser} />

                    <Spacer>
                        <Text style={{ fontWeight: 'bold' }}>
                            Following <FontAwesomeIcon icon={faUser} /> {`${currentUser.following.length} `}
                        </Text>
                        {currentUser && currentUser.following && currentUser.following.length > 0 ? (
                            <FlatList
                                data={currentUser.following}
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
                                                        leftAvatar={{
                                                            source: { uri: item.profileImage },
                                                            renderPlaceholderContent: <ActivityIndicator />,
                                                        }}
                                                        title={item.username}
                                                        rightElement={
                                                            <Button
                                                                title="Unfollow"
                                                                type="outline"
                                                                loading={item.unfollowUserIsLoading}
                                                                onPress={() =>
                                                                    this.props.unfollowUsersListUser({
                                                                        userId: item.userId,
                                                                        username: item.username,
                                                                        profileImage,
                                                                    })
                                                                }
                                                            />
                                                        }
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
                                <NavigationLink
                                    navigation={this.props.navigation}
                                    text={`Find someone to follow`}
                                    screen={Screens.Users}
                                />
                            </>
                        )}
                    </Spacer>
                    <Spacer>
                        <Text style={{ fontWeight: 'bold' }}>
                            Followers <FontAwesomeIcon icon={faUser} /> {`${currentUser.followers.length} `}
                        </Text>
                        {currentUser && currentUser.followers && currentUser.followers.length > 0 ? (
                            <FlatList
                                data={currentUser.followers}
                                keyExtractor={(follower) => follower.userId}
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
                                                        leftAvatar={{
                                                            source: { uri: item.profileImage },
                                                            renderPlaceholderContent: <ActivityIndicator />,
                                                        }}
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
                                <Text>{`You do not have any followers yet.`}</Text>
                            </>
                        )}
                    </Spacer>
                    <Spacer>
                        <Text style={{ fontWeight: 'bold' }}>Achievements</Text>
                        {currentUser && currentUser.achievements && currentUser.achievements.length > 0 ? (
                            <FlatList
                                data={currentUser.achievements}
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
                                <Text>{`You do not have any achievements yet.`}</Text>
                            </>
                        )}
                    </Spacer>
                    <Spacer>
                        <Text style={{ fontWeight: 'bold' }}>Activity Feed</Text>
                        <Text />
                        <GeneralActivityFeed
                            activityFeedItems={
                                currentUser && currentUser.activityFeed && currentUser.activityFeed.activityFeedItems
                            }
                            navigation={this.props.navigation}
                            currentUserId={currentUser._id}
                        />
                    </Spacer>
                    <Spacer>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontWeight: 'bold' }}> Push Notifications </Text>
                            {updatePushNotificationsIsLoading ? <ActivityIndicator /> : null}
                        </View>
                        <NotificationOptions
                            updatePushNotificationsErrorMessage={updatePushNotificationsErrorMessage}
                            updateCurrentUserPushNotifications={updateCurrentUserPushNotifications}
                            currentUser={currentUser}
                            updatePushNotificationsIsLoading={updatePushNotificationsIsLoading}
                        />
                    </Spacer>
                    <Spacer>
                        <Button
                            title="Logout"
                            onPress={() => {
                                logoutUser();
                                const parent = this.props.navigation.dangerouslyGetParent();
                                parent?.navigate(Screens.Landing);
                            }}
                        />
                    </Spacer>
                </View>
            </ScrollView>
        );
    }
}

const AccountScreen = connect(mapStateToProps, mapDispatchToProps)(AccountScreenComponent);

export { AccountScreen };
