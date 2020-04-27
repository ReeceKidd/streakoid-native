import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationState, NavigationParams, FlatList, NavigationEvents } from 'react-navigation';

import { HamburgerSelector } from '../components/HamburgerSelector';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { leaderboardActions } from '../actions/sharedActions';
import { Screens } from './Screens';
import { ListItem, Divider } from 'react-native-elements';
import { faChild, faPeopleCarry, faMedal, IconDefinition } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

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
        { name: 'Solo Streak', screen: Screens.SoloStreakLeaderboard, icon: faChild },
        { name: 'Team Streak', screen: Screens.TeamStreakLeaderboard, icon: faPeopleCarry },
        { name: 'Challenge Streak', screen: Screens.ChallengeStreakLeaderboard, icon: faMedal },
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
                                    <ListItem
                                        leftIcon={<FontAwesomeIcon icon={item.icon} />}
                                        title={item.name}
                                        chevron
                                    />
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
