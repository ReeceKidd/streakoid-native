import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Share } from 'react-native';
import { Text, ListItem, Button, Card, Divider } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShareAlt, faUsers, faCalendarCheck, faCrown, faAbacus } from '@fortawesome/pro-solid-svg-icons';
import { Platform } from 'react-native';

import { NavigationScreenProp, NavigationState, FlatList, NavigationEvents, ScrollView } from 'react-navigation';
import { Spacer } from '../components/Spacer';
import { AppState, AppActions } from '@streakoid/streakoid-shared/lib';
import { challengeActions } from '../actions/sharedActions';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ChallengeIcon } from '../components/ChallengeIcon';
import { Screens } from './Screens';
import { WhatsappGroupLink } from '../components/WhatsappGroupLink';
import { streakoidUrl } from '../streakoidUrl';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';

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

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, { _id: string; challengeName: string }>;
}
type Props = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    NavigationProps & { isFocused: boolean };

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

class ChallengeInfoScreenComponent extends Component<Props> {
    static navigationOptions = ({
        navigation,
    }: {
        navigation: NavigationScreenProp<NavigationState, { _id: string; challengeName: string }>;
    }) => {
        const challengeName = navigation.getParam('challengeName');
        const challengeId = navigation.getParam('_id');
        return {
            title: challengeName,
            headerRight: challengeName ? (
                <Button
                    type="clear"
                    icon={<FontAwesomeIcon icon={faShareAlt} size={20} />}
                    onPress={async () => {
                        await Share.share({
                            message: `Join the ${challengeName} challenge at ${streakoidUrl}/${RouterCategories.challenges}/${challengeId}`,
                            url: `${streakoidUrl}/${RouterCategories.challenges}/${challengeId}`,
                            title: `Join the ${challengeName} challenge`,
                        });
                    }}
                />
            ) : null,
        };
    };
    joinChallenge(challengeId: string) {
        this.props.joinChallenge({ challengeId, isAppleDevice: Platform.OS === 'ios' });
    }

    render(): JSX.Element | null {
        const { getChallenge, selectedChallenge, getSelectedChallengeIsLoading, joinChallengeIsLoading } = this.props;
        if (!selectedChallenge) {
            return null;
        }
        return (
            <ScrollView style={styles.container}>
                <NavigationEvents
                    onWillFocus={() => {
                        getChallenge({
                            challengeId: this.props.navigation.getParam('_id'),
                        });
                    }}
                />
                {getSelectedChallengeIsLoading ? (
                    <Spacer>
                        <ActivityIndicator />
                    </Spacer>
                ) : (
                    <Spacer>
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <ChallengeIcon icon={selectedChallenge.icon} color={selectedChallenge.color} />
                            <Text h4 style={{ textAlign: 'center' }}>
                                {this.props.navigation.getParam('challengeName')}
                            </Text>
                            <Text style={{ textAlign: 'center' }}>{selectedChallenge.description}</Text>
                        </View>
                        <Spacer></Spacer>
                        {selectedChallenge.userIsApartOfChallenge ? (
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate(Screens.ChallengeStreakInfo, {
                                        _id: selectedChallenge.usersChallengeStreakId,
                                        streakName: this.props.navigation.getParam('challengeName'),
                                    })
                                }
                            >
                                <Text style={{ textAlign: 'center', color: 'blue' }}>Track this challenge</Text>
                            </TouchableOpacity>
                        ) : (
                            <Button
                                loading={joinChallengeIsLoading}
                                title="Join challenge"
                                onPress={() => this.joinChallenge(selectedChallenge._id)}
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
                                <FontAwesomeIcon icon={faUsers} size={20} />
                                <Text style={{ textAlign: 'center' }}>Members</Text>
                                <Text h4 style={{ textAlign: 'center' }}>
                                    {selectedChallenge.members.length}
                                </Text>
                            </Card>
                            <Card>
                                <FontAwesomeIcon icon={faCalendarCheck} size={20} />
                                <Text style={{ textAlign: 'center' }}>Longest Current Streak</Text>
                                <Text h4 style={{ textAlign: 'center' }}>
                                    {selectedChallenge.longestCurrentStreakForChallenge}
                                </Text>
                            </Card>
                            <Card>
                                <FontAwesomeIcon icon={faCrown} size={20} />
                                <Text style={{ textAlign: 'center' }}>Longest Ever Streak</Text>
                                <Text h4 style={{ textAlign: 'center' }}>
                                    {selectedChallenge.longestEverStreakForChallenge}
                                </Text>
                            </Card>
                            <Card>
                                <FontAwesomeIcon icon={faAbacus} size={20} />
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
                                        currentStreak,
                                        challengeStreakId,
                                        longestStreak,
                                        averageStreak,
                                        totalTimesTracked,
                                    } = item;
                                    const currentStreakText =
                                        currentStreak.numberOfDaysInARow !== 1
                                            ? `${currentStreak.numberOfDaysInARow.toString()} days`
                                            : `${currentStreak.numberOfDaysInARow.toString()} day`;
                                    const longestStreakText =
                                        longestStreak !== 1
                                            ? `Longest streak: ${longestStreak} days`
                                            : `Longest streak: ${longestStreak} day`;
                                    const averageStreakText =
                                        averageStreak !== 1
                                            ? `Average streak: ${averageStreak.toFixed(2)} days`
                                            : `Average streak: ${averageStreak.toFixed(2)} day`;
                                    const totalTimesTrackedText =
                                        totalTimesTracked !== 1
                                            ? `Total times tracked: ${totalTimesTracked} times`
                                            : `Total times tracked: ${totalTimesTracked} time`;
                                    return (
                                        <>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.props.navigation.navigate(Screens.ChallengeStreakInfo, {
                                                        _id: challengeStreakId,
                                                    })
                                                }
                                            >
                                                <ListItem
                                                    leftElement={<Text>#{index + 1}</Text>}
                                                    leftAvatar={{
                                                        source: { uri: profileImage },
                                                    }}
                                                    title={username}
                                                    subtitle={currentStreakText}
                                                ></ListItem>
                                                <Text>{longestStreakText}</Text>
                                                <Text>{averageStreakText}</Text>
                                                <Text>{totalTimesTrackedText}</Text>
                                                <Spacer />
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
