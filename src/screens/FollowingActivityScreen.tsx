import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationState, NavigationParams, NavigationEvents } from 'react-navigation';

import { AppState } from '../../store';
import { HamburgerSelector } from '../../components/HamburgerSelector';
import { ScrollView } from 'react-native-gesture-handler';
import { FollowingActivityFeed } from '../../components/FollowingActivityFeed';
import { Spacer } from '../../components/Spacer';
import { Dispatch, bindActionCreators } from 'redux';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { activityFeedItemActions } from '../../actions/sharedActions';

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

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

class FollowingActivityScreenComponent extends Component<Props> {
    static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationState, {}> }) => {
        return {
            title: 'Following Activity',
            headerLeft: () => <HamburgerSelector navigation={navigation} />,
        };
    };

    render(): JSX.Element | null {
        const {
            currentUser,
            navigation,
            getFollowingActivityFeedItems,
            followingActivityFeed,
            getFollowingActivityFeedIsLoading,
            totalFollowingActivityFeedItems,
            clearFollowingActivityFeedItems,
        } = this.props;
        const limit = 20;
        const userIds = currentUser.following.map((user) => user.userId);
        return (
            <ScrollView>
                <NavigationEvents
                    onWillFocus={() => {
                        getFollowingActivityFeedItems({ limit, userIds });
                    }}
                    onWillBlur={() => {
                        clearFollowingActivityFeedItems();
                    }}
                />
                <Spacer>
                    <FollowingActivityFeed
                        getFollowingActivityFeedItems={getFollowingActivityFeedItems}
                        followingActivityFeed={followingActivityFeed}
                        getFollowingActivityFeedIsLoading={getFollowingActivityFeedIsLoading}
                        totalFollowingActivityFeedItems={totalFollowingActivityFeedItems}
                        limit={limit}
                        userIds={userIds}
                        navigation={navigation}
                    />
                </Spacer>
            </ScrollView>
        );
    }
}

const FollowingActivityScreen = connect(mapStateToProps, mapDispatchToProps)(FollowingActivityScreenComponent);
export { FollowingActivityScreen };
