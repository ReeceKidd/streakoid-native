import React, { PureComponent } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { NavigationState, NavigationParams, NavigationScreenProp } from 'react-navigation';
import { ListItem, Divider } from 'react-native-elements';

import { Screens } from '../screens/Screens';
import { Spacer } from './Spacer';
import { NavigationLink } from './NavigationLink';
import { BasicUser } from '@streakoid/streakoid-models/lib/Models/BasicUser';

interface FollowerListProps {
    followerList: BasicUser[];
}

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = FollowerListProps & NavigationProps;

class FollowerList extends PureComponent<Props> {
    navigateToFollowerProfile = (username: string) => {
        this.props.navigation.navigate(Screens.UserProfile, {
            username,
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
                                    this.navigateToFollowerProfile(item.username);
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
                    <NavigationLink
                        navigation={this.props.navigation}
                        text="No followers found. Add one."
                        screen={Screens.Users}
                    />
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
