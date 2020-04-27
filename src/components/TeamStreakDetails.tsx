import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ListItem } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/pro-solid-svg-icons';
import { PopulatedTeamStreak } from '@streakoid/streakoid-models/lib/Models/PopulatedTeamStreak';
import { PopulatedTeamMember } from '@streakoid/streakoid-models/lib/Models/PopulatedTeamMember';

interface TeamStreakDetailsProps {
    selectedTeamStreak: PopulatedTeamStreak;
}

class TeamStreakDetails extends Component<TeamStreakDetailsProps> {
    renderMemberHasCompletedTaskToday(completedToday: boolean) {
        return completedToday ? (
            <FontAwesomeIcon icon={faCheckCircle} size={20} color="green" />
        ) : (
            <FontAwesomeIcon icon={faTimesCircle} size={20} color="red" />
        );
    }

    renderMembersInfo(members: PopulatedTeamMember[]) {
        return (
            <FlatList
                data={members}
                keyExtractor={(member: PopulatedTeamMember) => member._id}
                renderItem={({ item }: { item: PopulatedTeamMember }) => {
                    const { username, profileImage, teamMemberStreak } = item;
                    return (
                        <View>
                            <ListItem
                                title={username}
                                leftAvatar={{
                                    source: { uri: profileImage },
                                    renderPlaceholderContent: <ActivityIndicator />,
                                }}
                                rightElement={this.renderMemberHasCompletedTaskToday(teamMemberStreak.completedToday)}
                            />
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
