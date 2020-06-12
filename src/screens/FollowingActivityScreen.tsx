import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../store';
import { View, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Spacer } from '../components/Spacer';
import { Dispatch, bindActionCreators } from 'redux';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { activityFeedItemActions } from '../actions/authenticatedSharedActions';
import ClientActivityFeedItemType from '@streakoid/streakoid-shared/lib/helpers/activityFeed/ClientActivityFeedItem';
import { StackNavigationProp } from '@react-navigation/stack';
import { ActivityFeedStackParamList } from '../screenNavigation/ActivityFeedStack';
import { Screens } from './Screens';
import { GeneralActivityFeed } from '../components/GeneralActivityFeed';
import { Text, Button } from 'react-native-elements';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    const followingActivityFeed = state && state.activityFeed.followingActivityFeed;
    const getFollowingActivityFeedIsLoading =
        state && state.activityFeed && state.activityFeed.getFollowingActivityFeedLoading;
    const totalFollowingActivityFeedItems =
        state && state.activityFeed && state.activityFeed.totalFollowingActivityFeedItems;
    return {
        currentUser,
        followingActivityFeed,
        getFollowingActivityFeedIsLoading,
        totalFollowingActivityFeedItems,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getFollowingActivityFeedItems: bindActionCreators(activityFeedItemActions.getFollowingActivityFeedItems, dispatch),
    clearFollowingActivityFeedItems: bindActionCreators(
        activityFeedItemActions.clearFollowingActivityFeedItems,
        dispatch,
    ),
});

type FollowingActivityScreenNavigationProp = StackNavigationProp<ActivityFeedStackParamList, Screens.FollowingActivity>;

type NavigationProps = {
    navigation: FollowingActivityScreenNavigationProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

interface FollowingActivityState {
    localFollowingActivityFeedItems: ClientActivityFeedItemType[];
}

class FollowingActivityScreenComponent extends PureComponent<Props, FollowingActivityState> {
    state: {
        localFollowingActivityFeedItems: ClientActivityFeedItemType[];
    } = {
        localFollowingActivityFeedItems: [],
    };
    componentDidMount() {
        const { currentUser, getFollowingActivityFeedItems } = this.props;
        const limit = 20;
        const userIds = currentUser.following.map((user) => user.userId);
        getFollowingActivityFeedItems({ limit, userIds });
    }

    componentDidUpdate(prevProps: Props): void {
        if (prevProps !== this.props) {
            const newFollowingActivityFeedItems = this.props.followingActivityFeed;

            const followingActivityFeedToBeAdded = newFollowingActivityFeedItems
                .map((activityFeedItem) => {
                    const isAlreadyInState = this.state.localFollowingActivityFeedItems.find(
                        (item) => item._id === activityFeedItem._id,
                    );
                    if (!isAlreadyInState) {
                        return activityFeedItem;
                    }
                })
                .filter(
                    (activityFeedItem): activityFeedItem is ClientActivityFeedItemType =>
                        activityFeedItem !== undefined,
                );
            this.setState({
                localFollowingActivityFeedItems: [
                    ...this.state.localFollowingActivityFeedItems,
                    ...followingActivityFeedToBeAdded,
                ],
            });
        }
    }

    loadMoreFollowingActivityFeedItems = (): void => {
        const currentUser = this.props.currentUser;
        const userIds = currentUser.following.map((user) => user.userId);
        const limit = 20;
        const query: { limit: number; userIds?: string[]; subjectId?: string } = { limit };
        if (userIds) {
            query.userIds = userIds;
        }

        const { localFollowingActivityFeedItems } = this.state;
        const lastFollowingActivityFeedItem =
            localFollowingActivityFeedItems[localFollowingActivityFeedItems.length - 1];

        if (!lastFollowingActivityFeedItem) {
            this.props.getFollowingActivityFeedItems(query);
        } else {
            this.props.getFollowingActivityFeedItems({
                ...query,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                createdAtBefore: new Date(lastFollowingActivityFeedItem.createdAt!),
            });
        }
    };

    render(): JSX.Element | null {
        const {
            followingActivityFeed,
            getFollowingActivityFeedIsLoading,
            totalFollowingActivityFeedItems,
        } = this.props;
        return (
            <ScrollView>
                <Spacer>
                    {!getFollowingActivityFeedIsLoading && followingActivityFeed.length === 0 ? (
                        <View style={{ flexDirection: 'row' }}>
                            <Text
                                style={{ color: 'blue' }}
                                onPress={() => this.props.navigation.navigate(Screens.Users)}
                            >{`Follow another user to see activity here`}</Text>
                        </View>
                    ) : null}
                    {getFollowingActivityFeedIsLoading ? <ActivityIndicator /> : null}
                    <GeneralActivityFeed
                        activityFeedItems={this.state.localFollowingActivityFeedItems}
                        navigation={this.props.navigation}
                        currentUserId={this.props.currentUser._id}
                    />
                    {followingActivityFeed.length >= totalFollowingActivityFeedItems ? null : (
                        <Spacer>
                            <Spacer />
                            <Button
                                buttonStyle={{ backgroundColor: 'blue' }}
                                title="Load more"
                                loading={getFollowingActivityFeedIsLoading}
                                onPress={() => this.loadMoreFollowingActivityFeedItems()}
                            />
                        </Spacer>
                    )}
                </Spacer>
            </ScrollView>
        );
    }
}

const FollowingActivityScreen = connect(mapStateToProps, mapDispatchToProps)(FollowingActivityScreenComponent);
export { FollowingActivityScreen };
