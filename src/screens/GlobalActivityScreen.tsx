import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../store';
import { ScrollView } from 'react-native-gesture-handler';
import { Spacer } from '../components/Spacer';
import { bindActionCreators, Dispatch } from 'redux';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import ClientActivityFeedItemType from '@streakoid/streakoid-shared/lib/helpers/activityFeed/ClientActivityFeedItem';
import { activityFeedItemActions } from '../actions/authenticatedSharedActions';
import { Text, Button } from 'react-native-elements';
import { GeneralActivityFeed } from '../components/GeneralActivityFeed';
import { ActivityIndicator } from 'react-native';
import { Screens } from './Screens';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    const globalActivityFeed = state && state.activityFeed && state.activityFeed.globalActivityFeed;
    const getGlobalActivityFeedLoading = state && state.activityFeed && state.activityFeed.getGlobalActivityFeedLoading;
    const totalGlobalActivityFeedItems = state && state.activityFeed && state.activityFeed.totalGlobalActivityFeedItems;
    return {
        currentUser,
        globalActivityFeed,
        getGlobalActivityFeedLoading,
        totalGlobalActivityFeedItems,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getGlobalActivityFeedItems: bindActionCreators(activityFeedItemActions.getGlobalActivityFeedItems, dispatch),
});

type GlobalActivityScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.GlobalActivity>;

type NavigationProps = {
    navigation: GlobalActivityScreenNavigationProp;
};
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

interface GlobalActivityState {
    localGlobalActivityFeedItems: ClientActivityFeedItemType[];
}

class GlobalActivityScreenComponent extends PureComponent<Props, GlobalActivityState> {
    state: {
        localGlobalActivityFeedItems: ClientActivityFeedItemType[];
    } = {
        localGlobalActivityFeedItems: [],
    };
    componentDidMount() {
        const { getGlobalActivityFeedItems } = this.props;
        const limit = 20;
        getGlobalActivityFeedItems({ limit });
    }

    componentDidUpdate(prevProps: Props): void {
        if (prevProps !== this.props) {
            const newGlobalActivityFeed = this.props.globalActivityFeed;

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
        const limit = 20;

        const { localGlobalActivityFeedItems } = this.state;
        const lastGlobalActivityFeedItem = localGlobalActivityFeedItems[localGlobalActivityFeedItems.length - 1];

        if (!lastGlobalActivityFeedItem) {
            this.props.getGlobalActivityFeedItems({ limit });
        } else {
            this.props.getGlobalActivityFeedItems({
                limit,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                createdAtBefore: new Date(lastGlobalActivityFeedItem.createdAt!),
            });
        }
    };

    render(): JSX.Element | null {
        const {
            globalActivityFeed,
            getGlobalActivityFeedLoading,
            totalGlobalActivityFeedItems,
            currentUser,
        } = this.props;

        return (
            <ScrollView>
                <Spacer>
                    {!getGlobalActivityFeedLoading && globalActivityFeed.length === 0 ? (
                        <Text style={{ color: 'red' }}>{`No activity `}</Text>
                    ) : null}
                    {getGlobalActivityFeedLoading ? <ActivityIndicator /> : null}
                    <GeneralActivityFeed
                        activityFeedItems={this.state.localGlobalActivityFeedItems}
                        navigation={this.props.navigation}
                        currentUserId={currentUser._id}
                    />
                    {globalActivityFeed.length >= totalGlobalActivityFeedItems ? null : (
                        <Spacer>
                            <Spacer />
                            <Button
                                buttonStyle={{ backgroundColor: 'blue' }}
                                title="Load more"
                                loading={getGlobalActivityFeedLoading}
                                onPress={() => this.loadMoreGlobalActivityFeedItems()}
                            />
                        </Spacer>
                    )}
                </Spacer>
            </ScrollView>
        );
    }
}

const GlobalActivityScreen = connect(mapStateToProps, mapDispatchToProps)(GlobalActivityScreenComponent);
export { GlobalActivityScreen };
