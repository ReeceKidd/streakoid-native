import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, ListItem, Button, Card, Divider } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUsers, faCalendarCheck, faCrown, faFlame, faCalendarTimes } from '@fortawesome/pro-solid-svg-icons';

import { Spacer } from '../components/Spacer';
import { AppState, AppActions } from '@streakoid/streakoid-shared/lib';
import { challengeActions } from '../actions/authenticatedSharedActions';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Screens } from './Screens';
import { WhatsappGroupLink } from '../components/WhatsappGroupLink';
import { streakoidAnalytics } from '../../streakoidAnalytics';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { RouteProp } from '@react-navigation/native';
import { ScrollView, FlatList } from 'react-native-gesture-handler';

const mapStateToProps = (state: AppState) => {
    const selectedChallenge = state && state.challenges && state.challenges.selectedChallenge;
    const getSelectedChallengeIsLoading = state && state.challenges && state.challenges.getSelectedChallengeIsLoading;
    const joinChallengeIsLoading = state && state.challenges && state.challenges.joinChallengeIsLoading;
    return { selectedChallenge, getSelectedChallengeIsLoading, joinChallengeIsLoading };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getChallenge: bindActionCreators(challengeActions.getChallenge, dispatch),
    joinChallenge: bindActionCreators(challengeActions.joinChallenge, dispatch),
});

type ChallengeInfoScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.ChallengeInfo>;
type ChallengeInfoScreenRouteProp = RouteProp<RootStackParamList, Screens.ChallengeInfo>;

type NavigationProps = {
    navigation: ChallengeInfoScreenNavigationProp;
    route: ChallengeInfoScreenRouteProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

class ChallengeInfoScreenComponent extends PureComponent<Props> {
    componentDidMount() {
        this.props.getChallenge({
            challengeId: this.props.route.params._id,
        });
    }

    joinChallenge(challengeId: string) {
        this.props.joinChallenge({ challengeId });
    }

    render(): JSX.Element | null {
        const { selectedChallenge, getSelectedChallengeIsLoading, joinChallengeIsLoading } = this.props;
        if (!selectedChallenge) {
            return null;
        }
        return (
            <ScrollView style={styles.container}>
                {getSelectedChallengeIsLoading ? (
                    <Spacer>
                        <ActivityIndicator />
                    </Spacer>
                ) : (
                    <Spacer>
                        {selectedChallenge.description ? <Text>{selectedChallenge.description}</Text> : null}
                        {selectedChallenge.userIsApartOfChallenge ? (
                            <ListItem
                                leftIcon={<FontAwesomeIcon icon={faCalendarCheck} />}
                                title={'Track this habit'}
                                subtitle={'Challenges are added to your challenge streaks'}
                                chevron={true}
                                onPress={() =>
                                    this.props.navigation.navigate(Screens.ChallengeStreakInfo, {
                                        _id: selectedChallenge.usersChallengeStreakId,
                                        challengeName: selectedChallenge.name,
                                    })
                                }
                            />
                        ) : (
                            <Button
                                loading={joinChallengeIsLoading}
                                title="Join challenge"
                                onPress={() => {
                                    streakoidAnalytics.joinedChallenge({
                                        challengeId: selectedChallenge._id,
                                        challengeName: selectedChallenge.name,
                                        numberOfMembersInChallenge: selectedChallenge.numberOfMembers,
                                    });
                                    this.joinChallenge(selectedChallenge._id);
                                }}
                            />
                        )}
                        {selectedChallenge.whatsappGroupLink ? (
                            <>
                                <Spacer>
                                    <WhatsappGroupLink
                                        challengeName={selectedChallenge.name}
                                        whatsappGroupLink={selectedChallenge.whatsappGroupLink}
                                    />
                                </Spacer>
                            </>
                        ) : null}
                        <Spacer>
                            <Card>
                                <FontAwesomeIcon icon={faUsers} />
                                <Text style={{ textAlign: 'center' }}>Members</Text>
                                <Text h4 style={{ textAlign: 'center' }}>
                                    {selectedChallenge.members.length}
                                </Text>
                            </Card>
                            <Card>
                                <FontAwesomeIcon icon={faCrown} color="gold" />
                                <Text style={{ textAlign: 'center' }}>Longest Ever Streak</Text>
                                <Text h4 style={{ textAlign: 'center' }}>
                                    {selectedChallenge.longestEverStreakForChallenge}
                                </Text>
                            </Card>
                            <Card>
                                <FontAwesomeIcon icon={faFlame} color="red" />
                                <Text style={{ textAlign: 'center' }}>Longest Current Streak</Text>
                                <Text h4 style={{ textAlign: 'center' }}>
                                    {selectedChallenge.longestCurrentStreakForChallenge}
                                </Text>
                            </Card>
                            <Card>
                                <FontAwesomeIcon icon={faCalendarTimes} />
                                <Text style={{ textAlign: 'center' }}>Total Times Tracked</Text>
                                <Text h4 style={{ textAlign: 'center' }}>
                                    {selectedChallenge.totalTimesTracked}
                                </Text>
                            </Card>
                        </Spacer>
                        <Spacer>
                            <Text style={{ fontWeight: 'bold' }}> Challenge Members </Text>
                            <FlatList
                                data={selectedChallenge.members}
                                keyExtractor={(challengeMember) => challengeMember.userId}
                                renderItem={({ item, index }) => {
                                    const {
                                        username,
                                        profileImage,
                                        challengeStreakId,
                                        longestChallengeStreakNumberOfDays,
                                        currentStreak,
                                        totalTimesTracked,
                                    } = item;
                                    return (
                                        <>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.props.navigation.navigate(Screens.ChallengeStreakInfo, {
                                                        _id: challengeStreakId,
                                                        challengeName: this.props.route.params.challengeName,
                                                    })
                                                }
                                            >
                                                <ListItem
                                                    leftElement={<Text>#{index + 1}</Text>}
                                                    leftAvatar={{
                                                        source: { uri: profileImage },
                                                    }}
                                                    title={username}
                                                    subtitle={
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text>
                                                                <FontAwesomeIcon
                                                                    icon={faCrown}
                                                                    style={{
                                                                        color:
                                                                            longestChallengeStreakNumberOfDays > 0
                                                                                ? 'gold'
                                                                                : 'grey',
                                                                    }}
                                                                />
                                                                {longestChallengeStreakNumberOfDays}
                                                            </Text>
                                                            <Text style={{ marginLeft: 5 }}>
                                                                <FontAwesomeIcon
                                                                    icon={faCalendarTimes}
                                                                    style={{
                                                                        color: totalTimesTracked > 0 ? 'black' : 'grey',
                                                                    }}
                                                                />
                                                                {totalTimesTracked}
                                                            </Text>
                                                        </View>
                                                    }
                                                    rightElement={
                                                        <Text>
                                                            <FontAwesomeIcon
                                                                icon={faFlame}
                                                                style={{
                                                                    color:
                                                                        currentStreak.numberOfDaysInARow > 0
                                                                            ? 'red'
                                                                            : 'grey',
                                                                }}
                                                            />
                                                            {currentStreak.numberOfDaysInARow}
                                                        </Text>
                                                    }
                                                ></ListItem>
                                            </TouchableOpacity>
                                            <Divider />
                                        </>
                                    );
                                }}
                            />
                        </Spacer>
                        <View />
                    </Spacer>
                )}
            </ScrollView>
        );
    }
}

const ChallengeInfoScreen = connect(mapStateToProps, mapDispatchToProps)(ChallengeInfoScreenComponent);

export { ChallengeInfoScreen };
