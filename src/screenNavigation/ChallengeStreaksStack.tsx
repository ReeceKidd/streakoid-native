/* eslint-disable react/display-name */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../screens/Screens';
import { Button } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faShareAlt } from '@fortawesome/pro-solid-svg-icons';
import { HamburgerSelector } from '../components/HamburgerSelector';
import { View, ActivityIndicator, Share } from 'react-native';
import { MAXIMUM_NUMBER_OF_FREE_STREAKS } from '../../config';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { streakoidUrl } from '../streakoidUrl';
import { ChallengeStreakInfoScreen } from '../screens/ChallengeStreakInfoScreen';
import { ChallengeStreaksScreen } from '../screens/ChallengeStreaksScreen';
import { AddNoteToChallengeStreakScreen } from '../screens/AddNoteToChallengeStreakScreen';

export type ChallengeStreaksStackParamList = {
    ChallengeStreaks: {
        isPayingMember: boolean;
        totalLiveStreaks: number;
        getMultipleLiveChallengeStreaksIsLoading: boolean;
    };
    ChallengeStreakInfo: { _id: string; streakName: string };
    AddNoteToChallengeStreak: undefined;
};

const Stack = createStackNavigator<ChallengeStreaksStackParamList>();

export const ChallengeStreaksStackScreen = (
    <Stack.Screen
        name={Screens.ChallengeStreaks}
        initialParams={{ getMultipleLiveChallengeStreaksIsLoading: false, totalLiveStreaks: 0 }}
        component={ChallengeStreaksScreen}
        options={({ route, navigation }) => ({
            title: 'Challenge Streaks',
            headerRight: () => {
                return (
                    <Button
                        type="clear"
                        icon={<FontAwesomeIcon icon={faPlus} size={30} />}
                        onPress={() => {
                            const userHasReachedFreeStreakLimit =
                                !route.params.isPayingMember &&
                                route.params.totalLiveStreaks > MAXIMUM_NUMBER_OF_FREE_STREAKS;
                            if (!userHasReachedFreeStreakLimit) {
                                return navigation.push(Screens.Challenges);
                            }
                            navigation.push(Screens.Upgrade);
                        }}
                    />
                );
            },
            headerLeft: () => (
                <View style={{ flexDirection: 'row' }}>
                    <HamburgerSelector />
                    {route.params.getMultipleLiveChallengeStreaksIsLoading ? <ActivityIndicator /> : null}
                </View>
            ),
        })}
    />
);

export const ChallengeStreakInfoStackScreen = (
    <Stack.Screen
        name={Screens.ChallengeStreakInfo}
        component={ChallengeStreakInfoScreen}
        options={({ route }) => ({
            title: route.params.streakName,
            headerRight: () => (
                <Button
                    type="clear"
                    icon={<FontAwesomeIcon icon={faShareAlt} />}
                    onPress={async () => {
                        await Share.share({
                            message: `View challenge streak ${route.params.streakName} at ${streakoidUrl}/${RouterCategories.challengeStreaks}/${route.params._id}`,
                            url: `${streakoidUrl}/${RouterCategories.challengeStreaks}/${route.params._id}`,
                            title: `View Streakoid challenge streak ${route.params.streakName}`,
                        });
                    }}
                />
            ),
        })}
    />
);

export const AddNoteToChallengeStreaksStackScreen = (
    <Stack.Screen name={Screens.AddNoteToChallengeStreak} component={AddNoteToChallengeStreakScreen} />
);

const ChallengeStreaksStack = () => (
    <Stack.Navigator>
        {ChallengeStreaksStackScreen}
        {ChallengeStreakInfoStackScreen}
    </Stack.Navigator>
);

export { ChallengeStreaksStack };
