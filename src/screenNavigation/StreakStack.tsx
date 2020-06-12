/* eslint-disable react/display-name */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../screens/Screens';
import { Button } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { HamburgerSelector } from '../components/HamburgerSelector';
import { View, ActivityIndicator } from 'react-native';
import { MAXIMUM_NUMBER_OF_FREE_STREAKS } from '../../config';
import { HomeScreen } from '../screens/HomeScreen';
import { TeamStreaksStack } from './TeamStreaksStack';
import { ChallengeStreaksStack } from './ChallengeStreaksStack';
import { SoloStreaksStack } from './SoloStreaksStack';

export type StreakStackParamList = {
    Home: { userId: string };
    SoloStreaks: { isPayingMember: boolean; totalLiveStreaks: number; getMultipleLiveSoloStreaksIsLoading: boolean };
    ChallengeStreaks: {
        isPayingMember: boolean;
        totalLiveStreaks: number;
        getMultipleLiveChallengeStreaksIsLoading: boolean;
    };
    TeamStreaks: { isPayingMember: boolean; totalLiveStreaks: number; getMultipleLiveTeamStreaksIsLoading: boolean };
};

const Stack = createStackNavigator<StreakStackParamList>();

const HomeStackScreen = (
    <Stack.Screen
        name={Screens.Home}
        component={HomeScreen}
        options={() => ({
            title: 'Streaks',
            headerLeft: () => <HamburgerSelector />,
        })}
    />
);

const SoloStreakStackScreen = (
    <Stack.Screen
        name={Screens.SoloStreaks}
        component={SoloStreaksStack}
        options={({ route, navigation }) => ({
            title: 'Solo Streaks',
            headerRight: () => {
                const userHasReachedFreeStreakLimit =
                    !route.params.isPayingMember && route.params.totalLiveStreaks > MAXIMUM_NUMBER_OF_FREE_STREAKS;
                return (
                    <Button
                        type="clear"
                        icon={<FontAwesomeIcon icon={faPlus} size={30} />}
                        onPress={() => {
                            if (!userHasReachedFreeStreakLimit) {
                                return navigation.push(Screens.CreateSoloStreak);
                            }
                            navigation.push(Screens.Upgrade);
                        }}
                    />
                );
            },
            headerLeft: () => (
                <View style={{ flexDirection: 'row' }}>
                    <HamburgerSelector />
                    {route.params.getMultipleLiveSoloStreaksIsLoading ? <ActivityIndicator /> : null}
                </View>
            ),
        })}
    />
);

const ChallengeStreaksStackScreen = (
    <Stack.Screen
        name={Screens.ChallengeStreaks}
        component={ChallengeStreaksStack}
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

const TeamStreaksStackScreen = (
    <Stack.Screen
        name={Screens.TeamStreaks}
        component={TeamStreaksStack}
        options={({ route, navigation }) => ({
            title: 'Team Streaks',
            headerRight: () => {
                const userHasReachedFreeStreakLimit =
                    !route.params.isPayingMember && route.params.totalLiveStreaks > MAXIMUM_NUMBER_OF_FREE_STREAKS;
                return (
                    <Button
                        type="clear"
                        icon={<FontAwesomeIcon icon={faPlus} size={30} />}
                        onPress={() => {
                            if (!userHasReachedFreeStreakLimit) {
                                return navigation.navigate(Screens.CreateTeamStreak);
                            }
                            navigation.navigate(Screens.Upgrade);
                        }}
                    />
                );
            },
            headerLeft: () => (
                <View style={{ flexDirection: 'row' }}>
                    <HamburgerSelector />
                    {route.params.getMultipleLiveTeamStreaksIsLoading ? <ActivityIndicator /> : null}
                </View>
            ),
        })}
    />
);

const StreakStack = () => (
    <Stack.Navigator>
        {HomeStackScreen}
        {SoloStreakStackScreen}
        {ChallengeStreaksStackScreen}
        {TeamStreaksStackScreen}
    </Stack.Navigator>
);

export { StreakStack };
