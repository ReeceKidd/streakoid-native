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

interface GeneralActivityFeedComponentProps {
    activityFeedItems: ClientActivityFeedItemType[];
}

class GeneralActivityFeed extends PureComponent<GeneralActivityFeedComponentProps> {
    render(): JSX.Element {
        const { activityFeedItems } = this.props;
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
                                title={getActivityFeedItemContent(item)}
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
