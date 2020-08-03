import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../store';
import { ScrollView, TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import { Spacer } from '../components/Spacer';
import { AppActions, getStreakCompletionInfo } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { leaderboardActions } from '../actions/authenticatedSharedActions';
import { Screens } from './Screens';
import { Divider, Text } from 'react-native-elements';
import { View, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChild } from '@fortawesome/pro-solid-svg-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { RouteProp } from '@react-navigation/native';
import { IndividualStreakLeaderboardItem } from '../components/IndividualStreakLeaderboardItem';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    const soloStreakLeaderboard = state && state.leaderboards && state.leaderboards.soloStreakLeaderboard;
    const getSoloStreakLeaderboardIsLoading =
        state && state.leaderboards && state.leaderboards.getSoloStreakLeaderboardIsLoading;
    const getSoloStreakLeaderboardErrorMessage =
        state && state.leaderboards && state.leaderboards.getSoloStreakLeaderboardErrorMessage;
    return {
        currentUser,
        soloStreakLeaderboard,
        getSoloStreakLeaderboardIsLoading,
        getSoloStreakLeaderboardErrorMessage,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getSoloStreaksLeaderboard: bindActionCreators(leaderboardActions.getSoloStreakLeaderboard, dispatch),
});

type SoloStreakLeaderboardScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.SoloStreakLeaderboard>;
type SoloStreakLeaderboardScreenRouteProp = RouteProp<RootStackParamList, Screens.SoloStreakLeaderboard>;

type NavigationProps = {
    navigation: SoloStreakLeaderboardScreenNavigationProp;
    route: SoloStreakLeaderboardScreenRouteProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

class SoloStreakLeaderboardScreenComponent extends PureComponent<Props> {
    componentDidMount() {
        this.props.getSoloStreaksLeaderboard();
    }
    renderSoloStreakLeaderboard(): JSX.Element {
        const { soloStreakLeaderboard, currentUser } = this.props;
        return (
            <FlatList
                data={soloStreakLeaderboard}
                keyExtractor={(soloStreakLeaderboardItem) => soloStreakLeaderboardItem.streakId}
                renderItem={({ item, index }) => {
                    const {
                        currentStreak,
                        pastStreaks,
                        timezone,
                        streakCreatedAt,
                        streakId,
                        streakName,
                        userProfileImage,
                        longestSoloStreakNumberOfDays,
                        totalTimesTracked,
                    } = item;
                    const streakCompletionInfo = getStreakCompletionInfo({
                        pastStreaks,
                        currentStreak,
                        timezone,
                        createdAt: new Date(streakCreatedAt),
                    });
                    const daysSinceUserCompletedStreak =
                        streakCompletionInfo && streakCompletionInfo.daysSinceUserCompletedStreak;
                    const daysSinceUserCreatedStreak =
                        streakCompletionInfo && streakCompletionInfo.daysSinceUserCreatedStreak;
                    const negativeDayStreak = daysSinceUserCompletedStreak || daysSinceUserCreatedStreak || 0;
                    return (
                        <>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate(Screens.SoloStreakInfo, {
                                        _id: streakId,
                                        streakName: streakName,
                                        isUsersStreak: item.username === currentUser.username,
                                    })
                                }
                            >
                                <IndividualStreakLeaderboardItem
                                    index={index}
                                    currentStreakNumberOfDaysInARow={currentStreak.numberOfDaysInARow}
                                    longestStreakNumberOfDaysInARow={longestSoloStreakNumberOfDays}
                                    negativeDayStreak={negativeDayStreak}
                                    streakName={streakName}
                                    totalTimesTracked={totalTimesTracked}
                                    userProfileImage={userProfileImage}
                                />
                            </TouchableOpacity>
                            <Divider />
                        </>
                    );
                }}
            />
        );
    }

    render(): JSX.Element | null {
        const { getSoloStreakLeaderboardIsLoading } = this.props;
        return (
            <ScrollView>
                <Spacer>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                            Solo Streak Leaderboard <FontAwesomeIcon icon={faChild} />
                        </Text>
                        {getSoloStreakLeaderboardIsLoading ? <ActivityIndicator style={{ marginLeft: 10 }} /> : null}
                    </View>
                    {this.renderSoloStreakLeaderboard()}
                </Spacer>
            </ScrollView>
        );
    }
}

const SoloStreakLeaderboardScreen = connect(mapStateToProps, mapDispatchToProps)(SoloStreakLeaderboardScreenComponent);
export { SoloStreakLeaderboardScreen };
