import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';

import { AppState } from '../../store';
import { Button, Avatar, Text, ListItem } from 'react-native-elements';
import { Spacer } from '../components/Spacer';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { userActions, profilePictureActions } from '../actions/authenticatedSharedActions';
import { authActions } from '../actions/authActions';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faUserCrown, faStarExclamation } from '@fortawesome/pro-solid-svg-icons';
import { NotificationOptions } from '../components/NotificationOptions';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Screens } from './Screens';
import { GeneralActivityFeed } from '../components/GeneralActivityFeed';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AccountStrengthProgressBar } from '../components/AccountStrengthProgressBar';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { apiUrl } from '../api/authenticatedStreakoid';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import SupportedRequestHeaders from '@streakoid/streakoid-models/lib/Types/SupportedRequestHeaders';
import { ProfileImages } from '@streakoid/streakoid-models/lib/Models/ProfileImages';
import { getAccountCompletionPercentage } from '@streakoid/streakoid-shared/lib/helpers/progress/getAccountCompletionPercentage';
import { faCoins } from '@fortawesome/pro-solid-svg-icons';
import { faDiamond } from '@fortawesome/pro-solid-svg-icons';
import { LongestStreakCards } from './LongestStreakCards';

const mapStateToProps = (state: AppState) => {
    const selectedUser = state && state.users && state.users.selectedUser;
    const currentUser = state && state.users && state.users.currentUser;
    const getCurrentUserErrorMessage = state && state.users && state.users.getCurrentUserErrorMessage;
    const getCurrentUserIsLoading = state && state.users && state.users.getCurrentUserIsLoading;
    const liveChallengeStreaks = state && state.challengeStreaks && state.challengeStreaks.liveChallengeStreaks;
    const getLiveChallengeStreaksIsLoading =
        state && state.challengeStreaks && state.challengeStreaks.getLiveChallengeStreaksIsLoading;
    const updatePushNotificationsIsLoading =
        state && state.users && state.users.currentUser.updatePushNotificationsIsLoading;
    const updatePushNotificationsErrorMessage =
        state && state.users && state.users.currentUser.updatePushNotificationsErrorMessage;
    const uploadProfileImageErrorMessage = state && state.users && state.users.uploadProfileImageErrorMessage;
    const uploadProfileImageSuccessMessage = state && state.users && state.users.uploadProfileImageSuccessMessage;
    const idToken = state && state.auth && state.auth.idToken;
    return {
        selectedUser,
        currentUser,
        getCurrentUserErrorMessage,
        getCurrentUserIsLoading,
        liveChallengeStreaks,
        getLiveChallengeStreaksIsLoading,
        updatePushNotificationsIsLoading,
        updatePushNotificationsErrorMessage,
        uploadProfileImageErrorMessage,
        uploadProfileImageSuccessMessage,
        idToken,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    logoutUser: bindActionCreators(authActions.logoutUser, dispatch),
    getCurrentUser: bindActionCreators(userActions.getCurrentUser, dispatch),
    updateCurrentUser: bindActionCreators(userActions.updateCurrentUser, dispatch),
    unfollowUsersListUser: bindActionCreators(userActions.unfollowUsersListUser, dispatch),
    updateCurrentUserPushNotifications: bindActionCreators(userActions.updateCurrentUserPushNotifications, dispatch),
    uploadProfileImage: bindActionCreators(profilePictureActions.mobileUploadProfileImage, dispatch),
    defineUploadProfileImageErrorMessage: bindActionCreators(
        profilePictureActions.defineUploadProfileImageFailError,
        dispatch,
    ),
    clearUploadProfileImageMessages: bindActionCreators(
        profilePictureActions.clearUploadProfileImageMessages,
        dispatch,
    ),
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class AccountScreenComponent extends React.PureComponent<Props, { photo: any }> {
    constructor(props: Props) {
        super(props);
        this.state = {
            photo: null,
        };
    }
    componentDidMount() {
        this.props.getCurrentUser();
        this.props.navigation.setParams({
            username: this.props.currentUser.username || '',
        });
        this.props.clearUploadProfileImageMessages();
    }

    handleChoosePhoto = () => {
        const options = {
            noData: true,
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.uri) {
                this.setState({ photo: response });
                this.uploadPhoto();
            }
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    uploadPhoto = async () => {
        const { idToken } = this.props;
        // eslint-disable-next-line no-undef
        const formData = new FormData();
        const { photo } = this.state;

        formData.append('image', photo);

        const url = `${apiUrl}/v1/${RouterCategories.profileImages}`;

        const timezone = this.props.currentUser.timezone;

        try {
            const result = await RNFetchBlob.fetch(
                'POST',
                url,
                {
                    [SupportedRequestHeaders.Authorization]: idToken || '',
                    [SupportedRequestHeaders.Timezone]: timezone,
                    'Content-Type': 'multipart/form-data',
                },
                [
                    {
                        name: 'image',
                        filename: photo.fileName,
                        type: photo.type,
                        data: RNFetchBlob.wrap(photo.uri),
                    },
                ],
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.props.uploadProfileImage({ profileImages: result.data as ProfileImages });
        } catch (err) {
            this.props.defineUploadProfileImageErrorMessage(err.message);
        }
    };

    render(): JSX.Element {
        const {
            logoutUser,
            updateCurrentUserPushNotifications,
            currentUser,
            updatePushNotificationsIsLoading,
            updatePushNotificationsErrorMessage,
            uploadProfileImageErrorMessage,
            uploadProfileImageSuccessMessage,
        } = this.props;
        const profileImage = currentUser && currentUser.profileImages.originalImageUrl;
        const {
            longestEverStreak,
            longestCurrentStreak,
            longestSoloStreak,
            longestChallengeStreak,
            longestTeamMemberStreak,
            longestTeamStreak,
        } = currentUser;
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View>
                        <Spacer>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Avatar
                                    renderPlaceholderContent={<ActivityIndicator />}
                                    source={{ uri: (this.state.photo && this.state.photo.uri) || profileImage }}
                                    size="large"
                                    rounded
                                    onPress={() => this.handleChoosePhoto()}
                                />
                                {uploadProfileImageErrorMessage ? (
                                    <Text style={{ color: 'red', marginTop: 5 }}>{uploadProfileImageErrorMessage}</Text>
                                ) : null}
                                {uploadProfileImageSuccessMessage ? (
                                    <Text style={{ color: 'green', marginTop: 5 }}>
                                        {uploadProfileImageSuccessMessage}
                                    </Text>
                                ) : null}
                            </View>
                        </Spacer>
                        <Spacer>
                            <View style={{ flexDirection: 'row' }}>
                                <FontAwesomeIcon icon={faCoins} color="gold" />
                                <Text style={{ marginLeft: 5 }}>{currentUser.coins}</Text>

                                <View style={{ flexDirection: 'row', marginLeft: 5 }}>
                                    <FontAwesomeIcon icon={faDiamond} color="blue" />
                                    <Text style={{ marginLeft: 5 }}>{currentUser.oidXp}</Text>
                                </View>
                            </View>
                        </Spacer>

                        <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                            <Text style={{ marginRight: 5 }}>{currentUser.firstName}</Text>
                            <Text>{currentUser.lastName}</Text>
                        </View>
                        <Spacer>
                            <View>
                                <LongestStreakCards
                                    longestEverStreak={longestEverStreak}
                                    longestCurrentStreak={longestCurrentStreak}
                                    longestSoloStreak={longestSoloStreak}
                                    longestChallengeStreak={longestChallengeStreak}
                                    longestTeamMemberStreak={longestTeamMemberStreak}
                                    longestTeamStreak={longestTeamStreak}
                                    navigation={this.props.navigation}
                                    isUsersSoloStreak={true}
                                    userIsApartOfTeamStreak={true}
                                />
                            </View>
                        </Spacer>
                        <Spacer>
                            <Text style={{ fontWeight: 'bold' }}>
                                {`Account strength`} <FontAwesomeIcon icon={faUserCrown} />
                            </Text>
                        </Spacer>
                        <AccountStrengthProgressBar currentUser={currentUser} />

                        {getAccountCompletionPercentage({ currentUser }) < 100 ? (
                            <ListItem
                                containerStyle={{ backgroundColor: 'yellow' }}
                                leftIcon={<FontAwesomeIcon icon={faStarExclamation} />}
                                title={'Improve your account strength'}
                                chevron={true}
                                onPress={() => {
                                    this.props.navigation.navigate(Screens.WhatIsYourFirstName);
                                }}
                            />
                        ) : null}

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
                                                                profileImage: item.profileImage,
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
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate(Screens.Users)}>
                                        <Text style={{ color: 'blue' }}>{`Find someone to follow`}</Text>
                                    </TouchableOpacity>
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
                                                                profileImage: item.profileImage,
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
                                    currentUser &&
                                    currentUser.activityFeed &&
                                    currentUser.activityFeed.activityFeedItems
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
                                }}
                            />
                        </Spacer>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const AccountScreen = connect(mapStateToProps, mapDispatchToProps)(AccountScreenComponent);

export { AccountScreen };
