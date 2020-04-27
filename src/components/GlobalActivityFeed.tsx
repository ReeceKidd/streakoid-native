/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { Component } from 'react';

import { NavigationScreenProp, NavigationParams, NavigationState } from 'react-navigation';
import { Text, Button } from 'react-native-elements';
import { Spacer } from './Spacer';
import { ActivityIndicator } from 'react-native';
import { activityFeedItemActions } from '../actions/sharedActions';
import { GeneralActivityFeed } from './GeneralActivityFeed';
import ClientActivityFeedItemType from '@streakoid/streakoid-shared/lib/helpers/activityFeed/ClientActivityFeedItem';

interface GlobalActivityFeedProps {
    getGlobalActivityFeedItems: typeof activityFeedItemActions.getGlobalActivityFeedItems;
    globalActivityFeedItems: ClientActivityFeedItemType[];
    getGlobalActivityFeedItemsIsLoading: boolean;
    totalCountOfGlobalActivityFeedItems: number;
    limit: number;
}

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface GlobalActivityState {
    localGlobalActivityFeedItems: ClientActivityFeedItemType[];
}

type Props = GlobalActivityFeedProps & NavigationProps;

export class GlobalActivityFeed extends Component<Props, GlobalActivityState> {
    state: {
        localGlobalActivityFeedItems: ClientActivityFeedItemType[];
    } = {
        localGlobalActivityFeedItems: [],
    };
    componentDidUpdate(prevProps: GlobalActivityFeedProps): void {
        if (prevProps !== this.props) {
            const newGlobalActivityFeed = this.props.globalActivityFeedItems;

            const activityFeedItemsToBeAdded = newGlobalActivityFeed
                .map((activityFeedItem) => {
                    const isAlreadyInState = this.state.localGlobalActivityFeedItems.find(
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
                localGlobalActivityFeedItems: [
                    ...this.state.localGlobalActivityFeedItems,
                    ...activityFeedItemsToBeAdded,
                ],
            });
        }
    }

    loadMoreGlobalActivityFeedItems = (): void => {
        const limit = this.props.limit;

        const { localGlobalActivityFeedItems } = this.state;
        const lastGlobalActivityFeedItem = localGlobalActivityFeedItems[localGlobalActivityFeedItems.length - 1];

        if (!lastGlobalActivityFeedItem) {
            this.props.getGlobalActivityFeedItems({ limit });
        } else {
            this.props.getGlobalActivityFeedItems({
                limit,
                createdAtBefore: new Date(lastGlobalActivityFeedItem.createdAt!),
            });
        }
    };

    render(): JSX.Element {
        const {
            getGlobalActivityFeedItemsIsLoading,
            totalCountOfGlobalActivityFeedItems,
            globalActivityFeedItems,
        } = this.props;

        return (
            <>
                {!getGlobalActivityFeedItemsIsLoading && globalActivityFeedItems.length === 0 ? (
                    <Text style={{ color: 'red' }}>{`No activity `}</Text>
                ) : null}
                {getGlobalActivityFeedItemsIsLoading ? <ActivityIndicator /> : null}
                <GeneralActivityFeed
                    navigation={this.props.navigation}
                    activityFeedItems={this.state.localGlobalActivityFeedItems}
                />
                {globalActivityFeedItems.length >= totalCountOfGlobalActivityFeedItems ? null : (
                    <Spacer>
                        <Spacer />
                        <Button
                            buttonStyle={{ backgroundColor: 'blue' }}
                            title="Load more"
                            loading={getGlobalActivityFeedItemsIsLoading}
                            onPress={() => this.loadMoreGlobalActivityFeedItems()}
                        />
                    </Spacer>
                )}
            </>
        );
    }
}
