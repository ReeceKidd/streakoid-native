import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationState, NavigationParams, FlatList, NavigationEvents } from 'react-navigation';

import { HamburgerSelector } from '../../components/HamburgerSelector';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { leaderboardActions } from '../../actions/sharedActions';
import { Screens } from './Screens';
import { ListItem, Divider } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons';

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getSoloStreaksLeaderboard: bindActionCreators(leaderboardActions.getSoloStreakLeaderboard, dispatch),
    getTeamStreaksLeaderboard: bindActionCreators(leaderboardActions.getTeamStreakLeaderboard, dispatch),
    getChallengeStreaksLeaderboard: bindActionCreators(leaderboardActions.getChallengeStreakLeaderboard, dispatch),
});

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ReturnType<typeof mapDispatchToProps> & NavigationProps;

interface LeaderboardMenuOption {
    name: string;
    screen: Screens;
    icon: string;
}

class LeaderboardsScreenComponent extends Component<Props> {
    static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationState, {}> }) => {
        return {
            title: 'Leaderboards',
            headerLeft: () => <HamburgerSelector navigation={navigation} />,
        };
    };

    static LeaderboardsMenuOptions: LeaderboardMenuOption[] = [
        { name: 'Solo Streak', screen: Screens.SoloStreakLeaderboard, icon: 'child' },
        { name: 'Team Streak', screen: Screens.TeamStreakLeaderboard, icon: 'people-carry' },
        { name: 'Challenge Streak', screen: Screens.ChallengeStreakLeaderboard, icon: 'medal' },
    ];

    render(): JSX.Element | null {
        const { getSoloStreaksLeaderboard, getTeamStreaksLeaderboard, getChallengeStreaksLeaderboard } = this.props;
        return (
            <>
                <NavigationEvents
                    onWillFocus={() => {
                        getSoloStreaksLeaderboard();
                        getTeamStreaksLeaderboard();
                        getChallengeStreaksLeaderboard();
                    }}
                />
                <FlatList
                    data={LeaderboardsScreenComponent.LeaderboardsMenuOptions}
                    keyExtractor={(leaderboardMenuOption: LeaderboardMenuOption) => leaderboardMenuOption.name}
                    renderItem={({ item }) => {
                        return (
                            <>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate(item.screen)}>
                                    <ListItem leftIcon={<FontAwesome5 name={item.icon} />} title={item.name} chevron />
                                </TouchableOpacity>
                                <Divider />
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
