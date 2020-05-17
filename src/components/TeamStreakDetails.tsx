import React, { PureComponent } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { ListItem } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/pro-solid-svg-icons';
import { PopulatedTeamStreak } from '@streakoid/streakoid-models/lib/Models/PopulatedTeamStreak';
import { PopulatedTeamMember } from '@streakoid/streakoid-models/lib/Models/PopulatedTeamMember';
import { Screens } from '../screens/Screens';

interface TeamStreakDetailsProps {
    selectedTeamStreak: PopulatedTeamStreak;
    navigate: Function;
}

class TeamStreakDetails extends PureComponent<TeamStreakDetailsProps> {
    renderMemberHasCompletedTaskToday(completedToday: boolean) {
        return completedToday ? (
            <FontAwesomeIcon icon={faCheckCircle} color="green" />
        ) : (
            <FontAwesomeIcon icon={faTimesCircle} color="red" />
        );
    }

    renderMembersInfo(members: PopulatedTeamMember[]) {
        return (
            <FlatList
                data={members}
                keyExtractor={(member: PopulatedTeamMember) => member._id}
                renderItem={({ item }: { item: PopulatedTeamMember }) => {
                    const { username, profileImage, teamMemberStreak, _id } = item;
                    return (
                        <View>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigate(Screens.UserProfile, {
                                        username,
                                        _id,
                                    })
                                }
                            >
                                <ListItem
                                    title={username}
                                    leftAvatar={{
                                        source: { uri: profileImage },
                                        renderPlaceholderContent: <ActivityIndicator />,
                                    }}
                                    rightElement={this.renderMemberHasCompletedTaskToday(
                                        teamMemberStreak.completedToday,
                                    )}
                                />
                            </TouchableOpacity>
                        </View>
                    );
                }}
            />
        );
    }

    render() {
        const { selectedTeamStreak } = this.props;
        if (selectedTeamStreak) {
            return <View>{this.renderMembersInfo(selectedTeamStreak.members)}</View>;
        }
        return null;
    }
}

export { TeamStreakDetails };
