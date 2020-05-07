/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { Component } from 'react';

import { NavigationScreenProp, NavigationParams, NavigationState } from 'react-navigation';
import { Button } from 'react-native-elements';
import { Spacer } from './Spacer';
import { ActivityIndicator, View } from 'react-native';
import { activityFeedItemActions } from '../actions/sharedActions';
import { GeneralActivityFeed } from './GeneralActivityFeed';
import ClientActivityFeedItemType from '@streakoid/streakoid-shared/lib/helpers/activityFeed/ClientActivityFeedItem';
import { NavigationLink } from './NavigationLink';
import { Screens } from '../screens/Screens';

interface FollowingActivityFeedProps {
    getFollowingActivityFeedItems: typeof activityFeedItemActions.getFollowingActivityFeedItems;
    followingActivityFeed: ClientActivityFeedItemType[];
    getFollowingActivityFeedIsLoading: boolean;
    totalFollowingActivityFeedItems: number;
    userIds?: string[];
    limit?: number;
}

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = FollowingActivityFeedProps & NavigationProps;

interface FollowingActivityState {
    localFollowingActivityFeedItems: ClientActivityFeedItemType[];
}

export class FollowingActivityFeed extends Component<Props, FollowingActivityState> {
    state: {
        localFollowingActivityFeedItems: ClientActivityFeedItemType[];
    } = {
        localFollowingActivityFeedItems: [],
    };
    componentDidUpdate(prevProps: FollowingActivityFeedProps): void {
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
        const { userIds } = this.props;
        const limit = this.props.limit || 10;
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
                createdAtBefore: new Date(lastFollowingActivityFeedItem.createdAt!),
            });
        }
    };

    render(): JSX.Element {
        const {
            getFollowingActivityFeedIsLoading,
            totalFollowingActivityFeedItems,
            followingActivityFeed,
        } = this.props;

        return (
            <>
                {!getFollowingActivityFeedIsLoading && followingActivityFeed.length === 0 ? (
                    <View style={{ flexDirection: 'row' }}>
                        <NavigationLink
                            text={`Follow another user to see activity here.`}
                            navigation={this.props.navigation}
                            screen={Screens.Users}
                        />
                    </View>
                ) : null}
                {getFollowingActivityFeedIsLoading ? <ActivityIndicator /> : null}
                <GeneralActivityFeed
                    navigation={this.props.navigation}
                    activityFeedItems={this.state.localFollowingActivityFeedItems}
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
            </>
        );
    }
}
