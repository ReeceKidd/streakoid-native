import React, { PureComponent } from 'react';
import { Screens } from '../screens/Screens';
import { FlatList, TouchableOpacity, View, ActivityIndicator, Platform } from 'react-native';
import { NavigationState, NavigationParams, NavigationScreenProp, NavigationEvents } from 'react-navigation';
import { ListItem, Divider, Text, SearchBar, Button } from 'react-native-elements';
import { AppState, AppActions } from '@streakoid/streakoid-shared/lib';
import { Dispatch, bindActionCreators } from 'redux';
import { userActions } from '../actions/sharedActions';
import { connect } from 'react-redux';
import { FormattedUser } from '@streakoid/streakoid-models/lib/Models/FormattedUser';

const mapStateToProps = (state: AppState) => {
    const usersList = state && state.users && state.users.usersList;
    const getUsersListIsLoading = state && state.users && state.users.getUsersIsLoading;
    return {
        usersList,
        getUsersListIsLoading,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getUsers: bindActionCreators(userActions.getUsers, dispatch),
    followUsersListUser: bindActionCreators(userActions.followUsersListUser, dispatch),
    unfollowUsersListUser: bindActionCreators(userActions.unfollowUsersListUser, dispatch),
});

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface State {
    searchQuery: string;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

class UsersListComponent extends PureComponent<Props, State> {
    state: State = {
        searchQuery: '',
    };
    navigateToUser = (username: string, _id: string) => {
        this.props.navigation.navigate(Screens.UserProfile, {
            username,
            _id,
        });
    };

    updateSearch = (searchQuery: string) => {
        this.setState({ searchQuery });
        this.props.getUsers({ limit: 5, searchQuery });
    };
    renderUsersList(): JSX.Element {
        const { usersList } = this.props;
        return (
            <>
                <FlatList
                    data={usersList}
                    keyExtractor={(user: FormattedUser) => user._id}
                    renderItem={({ item }) => {
                        const { profileImages } = item;
                        const profileImage = profileImages && profileImages.originalImageUrl;
                        return (
                            <View>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.navigateToUser(item.username, item._id);
                                    }}
                                >
                                    <ListItem
                                        title={item.username}
                                        leftAvatar={{
                                            source: { uri: profileImage },
                                            renderPlaceholderContent: <ActivityIndicator />,
                                        }}
                                        rightElement={
                                            !item.isCurrentUserFollowing ? (
                                                <Button
                                                    title="Follow"
                                                    type="outline"
                                                    loading={item.followUserIsLoading}
                                                    onPress={() =>
                                                        this.props.followUsersListUser({
                                                            userId: item._id,
                                                            username: item.username,
                                                            profileImage,
                                                        })
                                                    }
                                                />
                                            ) : (
                                                <Button
                                                    title="Unfollow"
                                                    type="outline"
                                                    loading={item.unfollowUserIsLoading}
                                                    onPress={() =>
                                                        this.props.unfollowUsersListUser({
                                                            userId: item._id,
                                                            username: item.username,
                                                            profileImage,
                                                        })
                                                    }
                                                />
                                            )
                                        }
                                    />
                                </TouchableOpacity>
                                <Divider />
                            </View>
                        );
                    }}
                />
            </>
        );
    }

    renderEmptyState(): JSX.Element {
        return <Text> No users found</Text>;
    }

    render(): JSX.Element | null {
        const { usersList, getUsersListIsLoading } = this.props;
        const { searchQuery } = this.state;
        let platform: 'default' | 'ios' | 'android' = 'default';
        if (Platform.OS === 'ios') {
            platform = 'ios';
        }
        if (Platform.OS === 'android') {
            platform = 'android';
        }
        return (
            <>
                <NavigationEvents
                    onWillFocus={() => {
                        if (searchQuery) {
                            this.props.getUsers({ searchQuery, limit: 5 });
                        } else {
                            this.props.getUsers({ limit: 5 });
                        }
                    }}
                />
                <SearchBar
                    platform={platform}
                    placeholder={`Search for user`}
                    onChangeText={this.updateSearch}
                    value={searchQuery}
                    showLoading={getUsersListIsLoading}
                />
                {usersList && usersList.length > 0 ? this.renderUsersList() : this.renderEmptyState()}
            </>
        );
    }
}

const UsersList = connect(mapStateToProps, mapDispatchToProps)(UsersListComponent);
export { UsersList };
