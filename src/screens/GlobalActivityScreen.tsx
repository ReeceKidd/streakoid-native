import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationState, NavigationParams, NavigationEvents } from 'react-navigation';

import { AppState } from '../../store';
import { HamburgerSelector } from '../../components/HamburgerSelector';
import { ScrollView } from 'react-native-gesture-handler';
import { Spacer } from '../../components/Spacer';
import { bindActionCreators, Dispatch } from 'redux';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { activityFeedItemActions } from '../../actions/sharedActions';
import { GlobalActivityFeed } from '../../components/GlobalActivityFeed';

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
    clearGlobalActivityFeedItems: bindActionCreators(activityFeedItemActions.clearGlobalActivityFeedItems, dispatch),
});

export interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

class GlobalActivityScreenComponent extends Component<Props> {
    static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationState, {}> }) => {
        return {
            title: 'Global Activity',
            headerLeft: () => <HamburgerSelector navigation={navigation} />,
        };
    };

    render(): JSX.Element | null {
        const {
            navigation,
            getGlobalActivityFeedItems,
            globalActivityFeed,
            getGlobalActivityFeedLoading,
            totalGlobalActivityFeedItems,
            clearGlobalActivityFeedItems,
        } = this.props;
        const limit = 20;
        return (
            <ScrollView>
                <NavigationEvents
                    onWillFocus={() => {
                        getGlobalActivityFeedItems({ limit });
                    }}
                    onWillBlur={() => {
                        clearGlobalActivityFeedItems();
                    }}
                />
                <Spacer>
                    <GlobalActivityFeed
                        getGlobalActivityFeedItems={getGlobalActivityFeedItems}
                        globalActivityFeedItems={globalActivityFeed}
                        getGlobalActivityFeedItemsIsLoading={getGlobalActivityFeedLoading}
                        totalCountOfGlobalActivityFeedItems={totalGlobalActivityFeedItems}
                        navigation={navigation}
                        limit={limit}
                    />
                </Spacer>
            </ScrollView>
        );
    }
}

const GlobalActivityScreen = connect(mapStateToProps, mapDispatchToProps)(GlobalActivityScreenComponent);
export { GlobalActivityScreen };
