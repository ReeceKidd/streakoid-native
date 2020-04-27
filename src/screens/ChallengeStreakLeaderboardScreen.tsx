import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationState, NavigationParams, FlatList, NavigationEvents } from 'react-navigation';

import { AppState } from '../../store';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Spacer } from '../../components/Spacer';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { leaderboardActions } from '../../actions/sharedActions';
import { Screens } from './Screens';
import { ListItem, Divider, Text } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';

const mapStateToProps = (state: AppState) => {
    const challengeStreakLeaderboard = state && state.leaderboards && state.leaderboards.challengeStreakLeaderboard;
    const getChallengeStreakLeaderboardIsLoading =
        state && state.leaderboards && state.leaderboards.getChallengeStreakLeaderboardIsLoading;
    const getChallengeStreakLeaderboardErrorMessage =
        state && state.leaderboards && state.leaderboards.getChallengeStreakLeaderboardErrorMessage;
    return {
        challengeStreakLeaderboard,
        getChallengeStreakLeaderboardIsLoading,
        getChallengeStreakLeaderboardErrorMessage,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getChallengeStreaksLeaderboard: bindActionCreators(leaderboardActions.getChallengeStreakLeaderboard, dispatch),
});

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

class ChallengeStreakLeaderboardScreenComponent extends Component<Props> {
    renderChallengeStreakLeaderboard(): JSX.Element {
        const { challengeStreakLeaderboard } = this.props;
        return (
            <FlatList
                data={challengeStreakLeaderboard}
                keyExtractor={(challengeStreakLeaderboardItem) => challengeStreakLeaderboardItem.streakId}
                renderItem={({ item, index }) => {
                    const { currentStreakNumberOfDaysInARow, streakId, challengeName, userProfileImage } = item;
                    return (
                        <>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate(Screens.ChallengeStreakInfo, {
                                        _id: streakId,
                                        streakName: challengeName,
                                    })
                                }
                            >
                                <ListItem
                                    leftElement={<Text>#{index + 1}</Text>}
                                    leftAvatar={{
                                        source: { uri: userProfileImage },
                                    }}
                                    title={challengeName}
                                    subtitle={
                                        currentStreakNumberOfDaysInARow !== 1
                                            ? `${currentStreakNumberOfDaysInARow.toString()} days`
                                            : `${currentStreakNumberOfDaysInARow.toString()} day`
                                    }
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
        const { getChallengeStreaksLeaderboard, getChallengeStreakLeaderboardIsLoading } = this.props;
        return (
            <ScrollView>
                <NavigationEvents
                    onWillFocus={() => {
                        getChallengeStreaksLeaderboard();
                    }}
                />
                <Spacer>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={{ fontWeight: 'bold' }}>
                            Challenge Streak Leaderboard <FontAwesome5 name="medal" size={20} />
                        </Text>
                        {getChallengeStreakLeaderboardIsLoading ? (
                            <ActivityIndicator style={{ marginLeft: 10 }} />
                        ) : null}
                    </View>
                    {this.renderChallengeStreakLeaderboard()}
                </Spacer>
            </ScrollView>
        );
    }
}

const ChallengeStreakLeaderboardScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ChallengeStreakLeaderboardScreenComponent);
export { ChallengeStreakLeaderboardScreen };
