import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Screens } from '../../screens/Screens';
import { Text } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import ClientActivityFeedItemType from '@streakoid/streakoid-shared/lib/helpers/activityFeed/ClientActivityFeedItem';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { StackNavigationProp } from '@react-navigation/stack';

const styles = StyleSheet.create({
    link: {
        color: 'blue',
    },
});

export const getFormattedCreatedAtString = (activityFeedItemCreatedAt: string) => {
    const date = new Date(activityFeedItemCreatedAt).toDateString();
    const hours = new Date(activityFeedItemCreatedAt).getHours();
    const minutes = new Date(activityFeedItemCreatedAt).getMinutes();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${date} - ${hours}:${formattedMinutes}`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getActivityFeedItemContent = ({
    currentUserId,
    activityFeedItem,
    navigation,
}: {
    currentUserId: string;
    activityFeedItem: ClientActivityFeedItemType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigation: StackNavigationProp<any>;
}) => {
    const { username, userId, title } = activityFeedItem;
    if (
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.createdSoloStreak ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.archivedSoloStreak ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.restoredSoloStreak ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.deletedSoloStreak ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.completedSoloStreak ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.incompletedSoloStreak ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.editedSoloStreakName ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.editedSoloStreakDescription ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.lostSoloStreak
    ) {
        return (
            <>
                <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(Screens.UserProfile, {
                                username,
                                _id: userId,
                            })
                        }
                    >
                        <Text style={styles.link}>{` ${username}`}</Text>
                    </TouchableOpacity>
                    <Text>{title}</Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(Screens.SoloStreakInfo, {
                                _id: activityFeedItem.soloStreakId,
                                streakName: activityFeedItem.soloStreakName,
                                isUsersStreak: activityFeedItem.userId === currentUserId,
                            })
                        }
                    >
                        <Text style={styles.link}>{activityFeedItem.soloStreakName}</Text>
                    </TouchableOpacity>
                </View>
            </>
        );
    }

    if (
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.completedChallengeStreak ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.incompletedChallengeStreak ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.joinedChallenge
    ) {
        return (
            <>
                <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(Screens.UserProfile, {
                                username,
                                _id: userId,
                            })
                        }
                    >
                        <Text style={styles.link}>{` ${username}`}</Text>
                    </TouchableOpacity>
                    <Text>{title}</Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(Screens.ChallengeInfo, {
                                _id: activityFeedItem.challengeId,
                                challengeName: activityFeedItem.challengeName,
                            })
                        }
                    >
                        <Text style={styles.link}>{activityFeedItem.challengeName}</Text>
                    </TouchableOpacity>
                </View>
            </>
        );
    }

    if (
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.archivedChallengeStreak ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.restoredChallengeStreak ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.deletedChallengeStreak ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.lostChallengeStreak
    ) {
        return (
            <>
                <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(Screens.UserProfile, {
                                username,
                                _id: userId,
                            })
                        }
                    >
                        <Text style={styles.link}>{` ${username}`}</Text>
                    </TouchableOpacity>
                    <Text>{title}</Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(Screens.ChallengeStreakInfo, {
                                _id: activityFeedItem._id || '',
                                streakName: activityFeedItem.challengeName,
                            })
                        }
                    >
                        <Text style={styles.link}>{activityFeedItem.challengeName}</Text>
                    </TouchableOpacity>
                </View>
            </>
        );
    }

    if (
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.createdTeamStreak ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.archivedTeamStreak ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.restoredTeamStreak ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.deletedTeamStreak ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.completedTeamMemberStreak ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.incompletedTeamMemberStreak ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.lostTeamStreak ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.joinedTeamStreak ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.editedTeamStreakName ||
        activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.editedTeamStreakDescription
    ) {
        return (
            <>
                <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(Screens.UserProfile, {
                                username,
                                _id: userId,
                            })
                        }
                    >
                        <Text style={styles.link}>{` ${username}`}</Text>
                    </TouchableOpacity>
                    <Text>{title}</Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(Screens.TeamStreakInfo, {
                                _id: activityFeedItem.teamStreakId,
                                streakName: activityFeedItem.teamStreakName,
                                userIsApartOfStreak: false,
                            })
                        }
                    >
                        <Text style={styles.link}>{activityFeedItem.teamStreakName}</Text>
                    </TouchableOpacity>
                </View>
            </>
        );
    }

    if (activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.createdAccount) {
        return (
            <>
                <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(Screens.UserProfile, {
                                username,
                                _id: userId,
                            })
                        }
                    >
                        <Text style={styles.link}>{` ${username}`}</Text>
                    </TouchableOpacity>
                    <Text>{title}</Text>
                </View>
            </>
        );
    }

    if (activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.followedUser) {
        return (
            <>
                <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(Screens.UserProfile, {
                                username,
                                _id: userId,
                            })
                        }
                    >
                        <Text style={styles.link}>{` ${username}`}</Text>
                    </TouchableOpacity>
                    <Text>{title}</Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(Screens.UserProfile, {
                                _id: activityFeedItem.userFollowedId,
                                username: activityFeedItem.userFollowedUsername,
                            })
                        }
                    >
                        <Text style={styles.link}>{activityFeedItem.userFollowedUsername}</Text>
                    </TouchableOpacity>
                </View>
            </>
        );
    }

    return (
        <>
            <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate(Screens.UserProfile, {
                            username,
                            _id: userId,
                        })
                    }
                >
                    <Text style={styles.link}>{` ${username}`}</Text>
                </TouchableOpacity>
                <Text>{title}</Text>
            </View>
        </>
    );
};
