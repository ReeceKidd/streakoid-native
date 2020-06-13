/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import {
    getActivityFeedItemContent,
    getFormattedCreatedAtString,
} from '../helpers/activityFeed/getActivityFeedItemContent';
import { ListItem, Avatar, Text } from 'react-native-elements';
import ClientActivityFeedItemType from '@streakoid/streakoid-shared/lib/helpers/activityFeed/ClientActivityFeedItem';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { Screens } from '../screens/Screens';

interface GeneralActivityFeedComponentProps {
    currentUserId: string;
    navigation: StackNavigationProp<RootStackParamList, Screens.FollowingActivity>;
    activityFeedItems: ClientActivityFeedItemType[];
}

class GeneralActivityFeed extends PureComponent<GeneralActivityFeedComponentProps> {
    render(): JSX.Element {
        const { activityFeedItems, currentUserId } = this.props;
        return (
            <FlatList
                data={activityFeedItems}
                keyExtractor={(activityFeedItem) => activityFeedItem._id!}
                renderItem={({ item }) => {
                    let subtitle;
                    if (item.activityFeedItemType === ActivityFeedItemTypes.editedSoloStreakDescription) {
                        subtitle = item.soloStreakDescription;
                    }
                    if (item.activityFeedItemType === ActivityFeedItemTypes.editedTeamStreakDescription) {
                        subtitle = item.teamStreakDescription;
                    }
                    return (
                        <>
                            <ListItem
                                leftAvatar={
                                    <Avatar
                                        rounded
                                        source={{
                                            uri: item.userProfileImage,
                                        }}
                                    />
                                }
                                title={getActivityFeedItemContent({
                                    activityFeedItem: item,
                                    navigation: this.props.navigation,
                                    currentUserId,
                                })}
                                subtitle={subtitle ? subtitle : undefined}
                            />
                            <Text style={{ textAlign: 'right', fontSize: 8 }}>
                                {getFormattedCreatedAtString(item.createdAt!)}
                            </Text>
                        </>
                    );
                }}
            />
        );
    }
}

export { GeneralActivityFeed };
