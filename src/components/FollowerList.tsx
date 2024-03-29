import React, { PureComponent } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { ListItem, Divider, Text } from 'react-native-elements';

import { Screens } from '../screens/Screens';
import { Spacer } from './Spacer';
import { BasicUser } from '@streakoid/streakoid-models/lib/Models/BasicUser';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';

interface FollowerListProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigation: StackNavigationProp<RootStackParamList, any>;
    followerList: BasicUser[];
}

type Props = FollowerListProps;

class FollowerList extends PureComponent<Props> {
    navigateToFollowerProfile = ({
        username,
        _id,
        profileImage,
    }: {
        username: string;
        _id: string;
        profileImage: string;
    }) => {
        this.props.navigation.navigate(Screens.UserProfile, {
            username,
            _id,
            profileImage,
        });
    };
    renderUsersList(): JSX.Element {
        const { followerList } = this.props;
        return (
            <FlatList
                data={followerList}
                keyExtractor={(follower: BasicUser) => follower.userId}
                renderItem={({ item }) => {
                    const { profileImage } = item;
                    return (
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    this.navigateToFollowerProfile({ username: item.username, _id: item.userId });
                                }}
                            >
                                <ListItem
                                    chevron
                                    title={item.username}
                                    leftAvatar={{ source: { uri: profileImage } }}
                                />
                            </TouchableOpacity>
                            <Divider />
                        </View>
                    );
                }}
            />
        );
    }

    renderEmptyState(): JSX.Element {
        return (
            <View>
                <Spacer>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate(Screens.Users)}>
                        <Text style={{ color: 'blue' }}>{`No followers found. Add one.`}</Text>
                    </TouchableOpacity>
                </Spacer>
            </View>
        );
    }

    render(): JSX.Element | null {
        const { followerList } = this.props;

        if (followerList) {
            return followerList.length > 0 ? this.renderUsersList() : this.renderEmptyState();
        }

        return null;
    }
}

export { FollowerList };
