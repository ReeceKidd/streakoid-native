/* eslint-disable react/display-name */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../screens/Screens';
import { HamburgerSelector } from '../components/HamburgerSelector';
import { UsersScreen } from '../screens/UsersScreen';
import { UserProfileScreen } from '../screens/UserProfileScreen';
import { Share } from 'react-native';
import { Button } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShareAlt } from '@fortawesome/pro-solid-svg-icons';
import { streakoidUrl } from '../streakoidUrl';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';

export type UserStackParamList = {
    Users: undefined;
    UserProfile: { _id: string; username: string };
};

const Stack = createStackNavigator<UserStackParamList>();

export const UsersStackScreen = (
    <Stack.Screen
        name={Screens.Users}
        component={UsersScreen}
        options={() => ({
            title: 'Users',
            headerLeft: () => <HamburgerSelector />,
        })}
    />
);

export const UsersProfileStackScreen = (
    <Stack.Screen
        name={Screens.UserProfile}
        component={UserProfileScreen}
        options={({ route }) => ({
            title: route.params.username,
            headerRight: () =>
                route.params.username ? (
                    <Button
                        type="clear"
                        icon={<FontAwesomeIcon icon={faShareAlt} />}
                        onPress={async () => {
                            await Share.share({
                                message: `View ${route.params.username}'s profile at ${streakoidUrl}/${RouterCategories.users}/${route.params.username}`,
                                url: `${streakoidUrl}/${RouterCategories.users}/${route.params.username}`,
                                title: `View ${route.params.username}'s Streakoid profile`,
                            });
                        }}
                    />
                ) : null,
        })}
    />
);

export const UsersStack = () => (
    <Stack.Navigator>
        {UsersStackScreen}
        {UsersProfileStackScreen}
    </Stack.Navigator>
);
