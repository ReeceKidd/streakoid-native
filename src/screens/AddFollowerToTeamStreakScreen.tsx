import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { View, StyleSheet } from 'react-native';
import { Spacer } from '../components/Spacer';
import { teamStreakActions } from '../actions/authenticatedSharedActions';
import { FlatList } from 'react-native-gesture-handler';
import { ListItem, Button } from 'react-native-elements';
import { NavigationLink } from '../components/NavigationLink';
import { Screens } from './Screens';
import { FollowerWithClientData } from '@streakoid/streakoid-shared/lib/reducers/userReducer';
import { BasicUser } from '@streakoid/streakoid-models/lib/Models/BasicUser';
import { RootStackParamList } from '../../StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    const selectedTeamStreak = state && state.teamStreaks.selectedTeamStreak;
    return { currentUser, selectedTeamStreak };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    addFollowerToTeamStreak: bindActionCreators(teamStreakActions.addFollowerToTeamStreak, dispatch),
});

type AddFollowerToTeamStreakScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    Screens.AddFollowerToTeamStreak
>;
type AddFollowerToTeamStreakScreenRouteProp = RouteProp<RootStackParamList, Screens.AddFollowerToTeamStreak>;

type NavigationProps = {
    navigation: AddFollowerToTeamStreakScreenNavigationProp;
    route: AddFollowerToTeamStreakScreenRouteProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class AddFollowerToTeamStreakScreenComponent extends PureComponent<Props> {
    static navigationOptions = {
        title: 'Add follower to team streak',
    };

    addFollowerToTeamStreak(followerId: string) {
        const { addFollowerToTeamStreak, navigation, selectedTeamStreak } = this.props;
        addFollowerToTeamStreak({ followerId, teamStreakId: selectedTeamStreak._id });
        navigation.navigate(Screens.TeamStreakInfo, {
            _id: selectedTeamStreak._id,
            streakName: selectedTeamStreak.streakName,
            userIsApartOfStreak: true,
        });
    }

    renderFollowersList(followersNotInTeamStreak: FollowerWithClientData[]): JSX.Element {
        return (
            <View style={styles.container}>
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
                                            onPress={() => this.addFollowerToTeamStreak(item.userId)}
                                        />
                                    }
                                />
                            </View>
                        );
                    }}
                />
            </View>
        );
    }

    renderEmptyState(): JSX.Element {
        return (
            <View>
                <Spacer>
                    <NavigationLink
                        navigation={this.props.navigation}
                        text="No followers not already in team streak found. Add one."
                        screen={Screens.Users}
                    />
                </Spacer>
            </View>
        );
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

        return followersNotInTeamStreak.length > 0
            ? this.renderFollowersList(followersNotInTeamStreak)
            : this.renderEmptyState();
    }
}

const AddFollowerToTeamStreakScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AddFollowerToTeamStreakScreenComponent);

export { AddFollowerToTeamStreakScreen };
