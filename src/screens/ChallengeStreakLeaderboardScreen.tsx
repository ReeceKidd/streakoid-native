import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../store';
import { ScrollView, TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import { Spacer } from '../components/Spacer';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { leaderboardActions } from '../actions/authenticatedSharedActions';
import { Screens } from './Screens';
import { ListItem, Divider, Text } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMedal } from '@fortawesome/pro-solid-svg-icons';
import { View, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { RouteProp } from '@react-navigation/native';

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

type ChallengeStreakLeaderboardScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    Screens.ChallengeStreakLeaderboard
>;
type ChallengeStreakLeaderboardScreenRouteProp = RouteProp<RootStackParamList, Screens.ChallengeStreakLeaderboard>;

type NavigationProps = {
    navigation: ChallengeStreakLeaderboardScreenNavigationProp;
    route: ChallengeStreakLeaderboardScreenRouteProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

class ChallengeStreakLeaderboardScreenComponent extends PureComponent<Props> {
    componentDidMount() {
        this.props.getChallengeStreaksLeaderboard();
    }
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
        const { getChallengeStreakLeaderboardIsLoading } = this.props;
        return (
            <ScrollView>
                <Spacer>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={{ fontWeight: 'bold' }}>
                            Challenge Streak Leaderboard <FontAwesomeIcon icon={faMedal} />
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
