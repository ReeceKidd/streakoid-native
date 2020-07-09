import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { Text } from 'react-native-elements';

import { View, StyleSheet, ScrollView, Share } from 'react-native';
import { Spacer } from '../components/Spacer';
import { teamStreakActions } from '../actions/authenticatedSharedActions';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { ListItem, Button } from 'react-native-elements';
import { Screens } from './Screens';
import { BasicUser } from '@streakoid/streakoid-models/lib/Models/BasicUser';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { RootStackParamList } from '../screenNavigation/RootNavigator';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    const selectedTeamStreak = state && state.teamStreaks.selectedTeamStreak;
    return { currentUser, selectedTeamStreak };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    addUserToTeamStreak: bindActionCreators(teamStreakActions.addUserToTeamStreak, dispatch),
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
        const { currentUser, selectedTeamStreak } = this.props;
        const followersNotInTeamStreak = currentUser.followers.filter((follower) => {
            const followerIsInTeamStreak = selectedTeamStreak.members.find((teamMember) => {
                return teamMember._id === follower.userId;
            });

            if (!followerIsInTeamStreak) {
                return follower;
            }
            return false;
        });

        return (
            <ScrollView style={styles.container}>
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
                        People with the link above will be able to join your team streak{' '}
                    </Text>
                    <Text style={{ fontWeight: 'bold' }}>Add one of your followers to the team streak </Text>
                    {followersNotInTeamStreak.length > 0 ? (
                        <FlatList
                            data={followersNotInTeamStreak}
                            keyExtractor={(follower: BasicUser) => follower.userId}
                            renderItem={({ item }) => {
                                const { profileImage } = item;
                                return (
                                    <View>
                                        <ListItem
                                            bottomDivider
                                            title={item.username}
                                            leftAvatar={{ source: { uri: profileImage } }}
                                            rightElement={
                                                <Button
                                                    title={'Add follower'}
                                                    onPress={() => this.addUserToTeamStreak({ userId: item.userId })}
                                                />
                                            }
                                        />
                                    </View>
                                );
                            }}
                        />
                    ) : (
                        <TouchableOpacity onPress={() => this.props.navigation.navigate(Screens.Users)}>
                            <Text
                                style={{ color: 'blue' }}
                            >{`No followers not already in team streak found. Add one.`}</Text>
                        </TouchableOpacity>
                    )}
                </Spacer>
                <Spacer />
            </ScrollView>
        );
    }
}

const AddUserToTeamStreakScreen = connect(mapStateToProps, mapDispatchToProps)(AddUserToTeamStreakScreenComponent);

export { AddUserToTeamStreakScreen };
