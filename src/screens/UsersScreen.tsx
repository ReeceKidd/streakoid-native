import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { AppState } from '../../store';
import { userActions } from '../actions/authenticatedSharedActions';
import { ScrollView, FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { Spacer } from '../components/Spacer';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens } from './Screens';
import { RouteProp } from '@react-navigation/native';
import { SearchBar, ListItem, Button, Divider } from 'react-native-elements';
import { Platform, View, ActivityIndicator } from 'react-native';
import { FormattedUserWithClientData } from '@streakoid/streakoid-shared/lib/reducers/userReducer';
import { streakoidAnalytics } from '../../streakoidAnalytics';
import { RootStackParamList } from '../screenNavigation/RootNavigator';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    const usersList = state && state.users && state.users.usersList;
    const getUsersListIsLoading = state && state.users && state.users.getUsersIsLoading;
    return {
        currentUser,
        usersList,
        getUsersListIsLoading,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getUsers: bindActionCreators(userActions.getUsers, dispatch),
    getCurrentUser: bindActionCreators(userActions.getCurrentUser, dispatch),
    followUsersListUser: bindActionCreators(userActions.followUsersListUser, dispatch),
    unfollowUsersListUser: bindActionCreators(userActions.unfollowUsersListUser, dispatch),
});

type UsersScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.Users>;
type UsersScreenRouteProp = RouteProp<RootStackParamList, Screens.Users>;

type NavigationProps = {
    navigation: UsersScreenNavigationProp;
    route: UsersScreenRouteProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

interface State {
    searchQuery: string;
}

class UsersScreenComponent extends PureComponent<Props, State> {
    state: State = {
        searchQuery: '',
    };
    componentDidMount() {
        this.props.getCurrentUser();
        this.props.getUsers({ limit: 5 });
    }
    updateSearch = (searchQuery: string) => {
        this.setState({ searchQuery });
        this.props.getUsers({ limit: 5, searchQuery });
    };
    render(): JSX.Element {
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
            <ScrollView>
                <Spacer>
                    <SearchBar
                        platform={platform}
                        placeholder={`Search for user`}
                        onChangeText={this.updateSearch}
                        value={searchQuery}
                        showLoading={getUsersListIsLoading}
                    />
                </Spacer>
                <FlatList
                    data={usersList}
                    keyExtractor={(user: FormattedUserWithClientData) => user._id}
                    renderItem={({ item }) => {
                        const { profileImages } = item;
                        const profileImage = profileImages && profileImages.originalImageUrl;
                        return (
                            <View>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate(Screens.UserProfile, {
                                            username: item.username,
                                            _id: item._id,
                                        });
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
                                                    onPress={() => {
                                                        streakoidAnalytics.followedUser({
                                                            userFollowedId: item._id,
                                                            userFollowedUsername: item.username,
                                                        });
                                                        this.props.followUsersListUser({
                                                            userId: item._id,
                                                            username: item.username,
                                                            profileImage,
                                                        });
                                                    }}
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
            </ScrollView>
        );
    }
}

const UsersScreen = connect(mapStateToProps, mapDispatchToProps)(UsersScreenComponent);
export { UsersScreen };
