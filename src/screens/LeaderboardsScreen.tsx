import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationState, NavigationParams, FlatList, NavigationEvents } from 'react-navigation';

import { HamburgerSelector } from '../components/HamburgerSelector';
import { AppActions, AppState } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { leaderboardActions } from '../actions/sharedActions';
import { Screens } from './Screens';
import { ListItem } from 'react-native-elements';
import {
    faChild,
    faPeopleCarry,
    faMedal,
    IconDefinition,
    faUserFriends,
    faGlobe,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const mapStateToProps = (state: AppState) => {
    const following = state && state.users && state.users.currentUser && state.users.currentUser.following;
    const currentUserId = state && state.users && state.users.currentUser && state.users.currentUser._id;
    const userIds = [...following.map((user) => user.userId), currentUserId];
    return {
        userIds,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getSoloStreaksLeaderboard: bindActionCreators(leaderboardActions.getSoloStreakLeaderboard, dispatch),
    getTeamStreaksLeaderboard: bindActionCreators(leaderboardActions.getTeamStreakLeaderboard, dispatch),
    getChallengeStreaksLeaderboard: bindActionCreators(leaderboardActions.getChallengeStreakLeaderboard, dispatch),
    getGlobalUserLeaderboard: bindActionCreators(leaderboardActions.getGlobalUserLeaderboard, dispatch),
    getFollowingLeaderboard: bindActionCreators(leaderboardActions.getFollowingLeaderboard, dispatch),
});

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

interface LeaderboardMenuOption {
    name: string;
    screen: Screens;
    icon: IconDefinition;
}

class LeaderboardsScreenComponent extends Component<Props> {
    static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationState, {}> }) => {
        return {
            title: 'Leaderboards',
            headerLeft: () => <HamburgerSelector navigation={navigation} />,
        };
    };

    static LeaderboardsMenuOptions: LeaderboardMenuOption[] = [
        { name: 'Following', screen: Screens.FollowingLeaderboard, icon: faUserFriends },
        { name: 'Global', screen: Screens.GlobalUserLeaderboard, icon: faGlobe },
        { name: 'Solo Streak', screen: Screens.SoloStreakLeaderboard, icon: faChild },
        { name: 'Team Streak', screen: Screens.TeamStreakLeaderboard, icon: faPeopleCarry },
        { name: 'Challenge Streak', screen: Screens.ChallengeStreakLeaderboard, icon: faMedal },
    ];

    componentDidMount() {
        const {
            getSoloStreaksLeaderboard,
            getTeamStreaksLeaderboard,
            getChallengeStreaksLeaderboard,
            getGlobalUserLeaderboard,
            getFollowingLeaderboard,
            userIds,
        } = this.props;
        getSoloStreaksLeaderboard();
        getTeamStreaksLeaderboard();
        getChallengeStreaksLeaderboard();
        getGlobalUserLeaderboard({});
        getFollowingLeaderboard({ userIds });
    }

    render(): JSX.Element | null {
        const {
            getSoloStreaksLeaderboard,
            getTeamStreaksLeaderboard,
            getChallengeStreaksLeaderboard,
            getGlobalUserLeaderboard,
            getFollowingLeaderboard,
            userIds,
        } = this.props;
        return (
            <>
                <NavigationEvents
                    onWillFocus={() => {
                        getSoloStreaksLeaderboard();
                        getTeamStreaksLeaderboard();
                        getChallengeStreaksLeaderboard();
                        getGlobalUserLeaderboard({});
                        getFollowingLeaderboard({ userIds });
                    }}
                />
                <FlatList
                    data={LeaderboardsScreenComponent.LeaderboardsMenuOptions}
                    keyExtractor={(leaderboardMenuOption: LeaderboardMenuOption) => leaderboardMenuOption.name}
                    renderItem={({ item }) => {
                        return (
                            <>
                                <ListItem
                                    leftIcon={<FontAwesomeIcon icon={item.icon} />}
                                    title={item.name}
                                    chevron
                                    onPress={() => this.props.navigation.navigate(item.screen)}
                                    bottomDivider
                                />
                            </>
                        );
                    }}
                />
            </>
        );
    }
}

const LeaderboardsScreen = connect(null, mapDispatchToProps)(LeaderboardsScreenComponent);
export { LeaderboardsScreen };
