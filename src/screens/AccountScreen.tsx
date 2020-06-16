import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';

import { AppState } from '../../store';
import { Button, Avatar, Text, ListItem } from 'react-native-elements';
import { Spacer } from '../components/Spacer';
import { AppActions, getIdToken } from '@streakoid/streakoid-shared/lib';
import { userActions, profilePictureActions } from '../actions/authenticatedSharedActions';
import { authActions } from '../actions/authActions';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faUserCrown } from '@fortawesome/pro-solid-svg-icons';
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
import { apiUrl } from '../api/authenticatedStreakoid';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import SupportedRequestHeaders from '@streakoid/streakoid-models/lib/Types/SupportedRequestHeaders';

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
    uploadProfileImage: bindActionCreators(profilePictureActions.mobileUploadProfileImage, dispatch),
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
        // eslint-disable-next-line no-undef
        const formData = new FormData();
        const { photo } = this.state;

        formData.append('image', photo);

        const url = `${apiUrl}/v1/${RouterCategories.profileImages}`;

        const idToken = await getIdToken();
        const timezone = this.props.currentUser.timezone;

        const uploadProfilePictureFunction = () =>
            RNFetchBlob.fetch(
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
                        type: 'image/jpeg',
                        data: RNFetchBlob.wrap(photo.uri),
                    },
                ],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) as any;
        this.props.uploadProfileImage({ uploadProfilePictureFunction });
    };

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
                                source={{ uri: (this.state.photo && this.state.photo.uri) || profileImage }}
                                size="large"
                                rounded
                                onPress={() => this.handleChoosePhoto()}
                            />
                        </View>
                    </Spacer>
                    <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                        <Text style={{ marginRight: 5 }}>{currentUser.firstName}</Text>
                        <Text>{currentUser.lastName}</Text>
                    </View>
                    <Spacer>
                        <Text style={{ fontWeight: 'bold' }}>
                            {`Account strength`} <FontAwesomeIcon icon={faUserCrown} />
                        </Text>
                    </Spacer>
                    <AccountStrengthProgressBar currentUser={currentUser} />
                    <Spacer>
                        {getAccountCompletionPercentage({ currentUser }) < 100 ? (
                            <Text
                                onPress={() => this.props.navigation.navigate(Screens.WhatIsYourFirstName)}
                                style={{ color: 'blue' }}
                            >{`Improve your account strength`}</Text>
                        ) : null}
                    </Spacer>

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
