import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Share } from 'react-native';
import { Text, ListItem, Button, Card, Divider } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faShareAlt,
    faUsers,
    faCalendarCheck,
    faCrown,
    faFlame,
    faCalendarTimes,
} from '@fortawesome/pro-solid-svg-icons';

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
                    icon={<FontAwesomeIcon icon={faShareAlt} />}
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
        this.props.joinChallenge({ challengeId });
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
                                <FontAwesomeIcon icon={faUsers} />
                                <Text style={{ textAlign: 'center' }}>Members</Text>
                                <Text h4 style={{ textAlign: 'center' }}>
                                    {selectedChallenge.members.length}
                                </Text>
                            </Card>
                            <Card>
                                <FontAwesomeIcon icon={faCalendarTimes} />
                                <Text style={{ textAlign: 'center' }}>Total Times Tracked</Text>
                                <Text h4 style={{ textAlign: 'center' }}>
                                    {selectedChallenge.totalTimesTracked}
                                </Text>
                            </Card>
                            <Card>
                                <FontAwesomeIcon icon={faCalendarCheck} />
                                <Text style={{ textAlign: 'center' }}>Longest Current Streak</Text>
                                <Text h4 style={{ textAlign: 'center' }}>
                                    {selectedChallenge.longestCurrentStreakForChallenge}
                                </Text>
                            </Card>
                            <Card>
                                <FontAwesomeIcon icon={faCrown} />
                                <Text style={{ textAlign: 'center' }}>Longest Ever Streak</Text>
                                <Text h4 style={{ textAlign: 'center' }}>
                                    {selectedChallenge.longestEverStreakForChallenge}
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
                                        totalTimesTracked,
                                    } = item;
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
                                                    subtitle={
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text>
                                                                <FontAwesomeIcon
                                                                    icon={faCalendarTimes}
                                                                    style={{
                                                                        color: totalTimesTracked > 0 ? 'black' : 'grey',
                                                                    }}
                                                                />
                                                                {totalTimesTracked}
                                                            </Text>
                                                            <Text style={{ marginLeft: 5 }}>
                                                                <FontAwesomeIcon
                                                                    icon={faCrown}
                                                                    style={{
                                                                        color: longestStreak > 0 ? 'gold' : 'grey',
                                                                    }}
                                                                />
                                                                {longestStreak}
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
