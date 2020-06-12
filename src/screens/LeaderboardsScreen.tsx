import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppActions, AppState } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { leaderboardActions } from '../actions/authenticatedSharedActions';
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
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../StackNavigator';
import { FlatList } from 'react-native-gesture-handler';

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

type LeaderboardsScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.Leaderboards>;
type LeaderboardsScreenRouteProp = RouteProp<RootStackParamList, Screens.Leaderboards>;

type NavigationProps = {
    navigation: LeaderboardsScreenNavigationProp;
    route: LeaderboardsScreenRouteProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

interface LeaderboardMenuOption {
    name: string;
    screen: Screens;
    icon: IconDefinition;
}

class LeaderboardsScreenComponent extends PureComponent<Props> {
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
        getGlobalUserLeaderboard({ limit: 25 });
        getFollowingLeaderboard({ userIds });
    }

    render(): JSX.Element | null {
        return (
            <>
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
