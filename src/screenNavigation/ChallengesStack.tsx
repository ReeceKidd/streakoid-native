/* eslint-disable react/display-name */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../screens/Screens';
import { HamburgerSelector } from '../components/HamburgerSelector';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Button } from 'react-native-elements';
import { faShareAlt } from '@fortawesome/pro-solid-svg-icons';
import { Share } from 'react-native';
import { streakoidUrl } from '../streakoidUrl';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { ChallengesScreen } from '../screens/ChallengesScreen';
import { ChallengeInfoScreen } from '../screens/ChallengeInfoScreen';

export type ChallengeStackParamList = {
    Challenges: undefined;
    ChallengeInfo: { _id: string; challengeName: string };
};

const Stack = createStackNavigator<ChallengeStackParamList>();

export const ChallengesStackScreen = (
    <Stack.Screen
        name={Screens.Challenges}
        component={ChallengesScreen}
        options={() => ({
            title: 'Challenges',
            headerLeft: () => <HamburgerSelector />,
        })}
    />
);

export const ChallengeInfoStackScreen = (
    <Stack.Screen
        name={Screens.ChallengeInfo}
        component={ChallengeInfoScreen}
        options={({ route }) => ({
            title: route.params.challengeName,
            headerRight: () =>
                route.params.challengeName ? (
                    <Button
                        type="clear"
                        icon={<FontAwesomeIcon icon={faShareAlt} />}
                        onPress={async () => {
                            await Share.share({
                                message: `Join the ${route.params.challengeName} challenge at ${streakoidUrl}/${RouterCategories.challenges}/${route.params._id}`,
                                url: `${streakoidUrl}/${RouterCategories.challenges}/${route.params._id}`,
                                title: `Join the ${route.params.challengeName} challenge`,
                            });
                        }}
                    />
                ) : null,
        })}
    />
);

export const ChallengesStack = () => (
    <Stack.Navigator>
        {ChallengesStackScreen}
        {ChallengeInfoStackScreen}
    </Stack.Navigator>
);
