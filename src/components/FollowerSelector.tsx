import React, { PureComponent } from 'react';
import { FlatList, View, Text } from 'react-native';
import { ListItem, Button } from 'react-native-elements';

import { Spacer } from './Spacer';
import { userActions } from '../actions/authenticatedSharedActions';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMinus, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { FollowerWithClientData } from '@streakoid/streakoid-shared/lib/reducers/userReducer';

interface FollowerSelectorProps {
    selectFollower: typeof userActions.selectFollower;
    unselectFollower: typeof userActions.unselectFollower;
    followers: FollowerWithClientData[];
}

type Props = FollowerSelectorProps;

class FollowerSelector extends PureComponent<Props> {
    renderFollowersSelectorOptions(follower: FollowerWithClientData): JSX.Element {
        const { unselectFollower, selectFollower } = this.props;
        return follower.isSelected ? (
            <Button
                type="clear"
                icon={<FontAwesomeIcon icon={faMinus} color="red" />}
                onPress={() => {
                    unselectFollower(follower.userId);
                }}
            />
        ) : (
            <Button
                type="clear"
                icon={<FontAwesomeIcon icon={faPlus} color="green" />}
                onPress={() => {
                    selectFollower(follower.userId);
                }}
            />
        );
    }
    renderFollowersList(): JSX.Element {
        const { followers } = this.props;
        return (
            <View>
                <FlatList
                    data={followers}
                    keyExtractor={(follower) => follower.userId}
                    renderItem={({ item }) => {
                        const { profileImage } = item;
                        return (
                            <View>
                                <ListItem
                                    bottomDivider
                                    title={item.username}
                                    leftAvatar={{ source: { uri: profileImage } }}
                                    rightElement={this.renderFollowersSelectorOptions(item)}
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
                    <Text>{'You have no followers yet'}</Text>
                </Spacer>
            </View>
        );
    }

    render(): JSX.Element | null {
        const { followers } = this.props;

        if (followers) {
            return followers.length > 0 ? this.renderFollowersList() : this.renderEmptyState();
        }

        return null;
    }
}

export { FollowerSelector };
