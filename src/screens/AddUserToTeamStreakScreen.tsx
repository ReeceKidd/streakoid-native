import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { Text } from 'react-native-elements';

import { View, StyleSheet, ScrollView, Share } from 'react-native';
import { Spacer } from '../components/Spacer';
import { teamStreakActions, userActions } from '../actions/authenticatedSharedActions';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { ListItem, Button } from 'react-native-elements';
import { Screens } from './Screens';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShare, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { faMinus, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { LoadingScreenSpinner } from '../components/LoadingScreenSpinner';

const mapStateToProps = (state: AppState) => {
    const selectedTeamStreak = state && state.teamStreaks && state.teamStreaks.selectedTeamStreak;
    const selectedTeamStreakIsLoading = state && state.teamStreaks && state.teamStreaks.getTeamStreakIsLoading;
    return { selectedTeamStreak, selectedTeamStreakIsLoading };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    getCurrentUser: bindActionCreators(userActions.getCurrentUser, dispatch),
    getSelectedTeamStreak: bindActionCreators(teamStreakActions.getSelectedTeamStreak, dispatch),
    addUserToTeamStreak: bindActionCreators(teamStreakActions.addUserToTeamStreak, dispatch),
    removeUserFromTeamStreak: bindActionCreators(teamStreakActions.removeUserFromTeamStreak, dispatch),
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 10,
    },
});

type AddUserToTeamStreakScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.AddUserToTeamStreak>;
type AddUserToTeamStreakScreenRouteProp = RouteProp<RootStackParamList, Screens.AddUserToTeamStreak>;

type NavigationProps = {
    navigation: AddUserToTeamStreakScreenNavigationProp;
    route: AddUserToTeamStreakScreenRouteProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

class AddUserToTeamStreakScreenComponent extends PureComponent<Props> {
    componentDidMount() {
        this.props.getCurrentUser();
        this.props.getSelectedTeamStreak(this.props.route.params.teamStreakId);
    }
    addUserToTeamStreak({ userId }: { userId: string }) {
        const { addUserToTeamStreak, navigation, selectedTeamStreak } = this.props;
        addUserToTeamStreak({ userId, teamStreakId: selectedTeamStreak._id });
        navigation.navigate(Screens.TeamStreakInfo, {
            _id: selectedTeamStreak._id,
            streakName: selectedTeamStreak.streakName,
            userIsApartOfStreak: true,
        });
    }

    render(): JSX.Element | null {
        const { selectedTeamStreak, selectedTeamStreakIsLoading } = this.props;

        return (
            <ScrollView style={styles.container}>
                <>
                    {selectedTeamStreakIsLoading ? (
                        <LoadingScreenSpinner />
                    ) : (
                        <>
                            <Spacer>
                                <Text style={{ fontWeight: 'bold' }}>Invite link</Text>
                                <ListItem
                                    style={{ marginBottom: 15 }}
                                    subtitle={selectedTeamStreak.inviteUrl}
                                    rightElement={
                                        <Button
                                            type="clear"
                                            icon={<FontAwesomeIcon icon={faShare} />}
                                            onPress={async () =>
                                                await Share.share({
                                                    message: `This ${selectedTeamStreak.streakName} team streak allows us to build a habit together. If one of us doesn't do the task we both lose the streak. Use this link to join with just one click: ${selectedTeamStreak.inviteUrl}`,
                                                    url: selectedTeamStreak.inviteUrl,
                                                    title: `Join my ${selectedTeamStreak.streakName} team streak`,
                                                })
                                            }
                                        />
                                    }
                                />
                                <Text style={{ marginBottom: 15 }}>
                                    People with the link above will be able to join your team streak.
                                </Text>
                                <Text style={{ fontWeight: 'bold' }}>
                                    Add one of your followers to the team streak.
                                </Text>
                                {selectedTeamStreak &&
                                selectedTeamStreak.possibleTeamMembers &&
                                selectedTeamStreak.possibleTeamMembers.length > 0 ? (
                                    <FlatList
                                        data={selectedTeamStreak.possibleTeamMembers}
                                        keyExtractor={(possibleTeamMember) => possibleTeamMember.userId}
                                        renderItem={({ item }) => {
                                            const { profileImage } = item;
                                            const isApartOfTeamStreak = Boolean(
                                                selectedTeamStreak.members.find(
                                                    (member) => String(member._id) === String(item.userId),
                                                ),
                                            );
                                            return (
                                                <View>
                                                    <ListItem
                                                        bottomDivider
                                                        title={item.username}
                                                        leftAvatar={{ source: { uri: profileImage } }}
                                                        rightElement={
                                                            isApartOfTeamStreak ? (
                                                                <Button
                                                                    loading={item.removeUserFromTeamStreakIsLoading}
                                                                    type="clear"
                                                                    icon={
                                                                        <FontAwesomeIcon icon={faMinus} color="red" />
                                                                    }
                                                                    onPress={() => {
                                                                        this.props.removeUserFromTeamStreak({
                                                                            userId: item.userId,
                                                                            teamStreakId: selectedTeamStreak._id,
                                                                        });
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Button
                                                                    loading={item.addUserToTeamStreakIsLoading}
                                                                    type="clear"
                                                                    icon={
                                                                        <FontAwesomeIcon icon={faPlus} color="green" />
                                                                    }
                                                                    onPress={() => {
                                                                        this.props.addUserToTeamStreak({
                                                                            userId: item.userId,
                                                                            teamStreakId: selectedTeamStreak._id,
                                                                        });
                                                                    }}
                                                                />
                                                            )
                                                        }
                                                    />
                                                </View>
                                            );
                                        }}
                                    />
                                ) : (
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate(Screens.Users)}>
                                        <Text style={{ color: 'red' }}>{`You have no followers yet.`}</Text>
                                    </TouchableOpacity>
                                )}
                            </Spacer>
                            <Spacer>
                                <Button
                                    title={` Go to your team streak`}
                                    icon={<FontAwesomeIcon icon={faArrowRight} color="white" />}
                                    onPress={() =>
                                        this.props.navigation.navigate(Screens.TeamStreakInfo, {
                                            _id: selectedTeamStreak._id,
                                            streakName: selectedTeamStreak.streakName,
                                            userIsApartOfStreak: true,
                                        })
                                    }
                                />
                            </Spacer>
                        </>
                    )}
                </>
            </ScrollView>
        );
    }
}

const AddUserToTeamStreakScreen = connect(mapStateToProps, mapDispatchToProps)(AddUserToTeamStreakScreenComponent);

export { AddUserToTeamStreakScreen };
