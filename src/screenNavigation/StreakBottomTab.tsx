/* eslint-disable react/display-name */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Screens } from '../screens/Screens';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarCheck, faPeopleCarry } from '@fortawesome/pro-solid-svg-icons';
import { faMedal, faChild } from '@fortawesome/free-solid-svg-icons';
import { streakStack, challengeStreakStack, teamStreakStack, soloStreakStack } from './RootNavigator';

export type StreakTabParamList = {
    Home: undefined;
    ChallengeStreaks: undefined;
    TeamStreaks: undefined;
    SoloStreaks: undefined;
};

const Tab = createBottomTabNavigator<StreakTabParamList>();

const StreakTabScreen = (
    <Tab.Screen
        name={Screens.Home}
        component={streakStack}
        options={() => ({
            title: 'Streaks',
            tabBarIcon: () => <FontAwesomeIcon icon={faCalendarCheck} />,
        })}
    />
);

const ChallengeStreaksTabScreen = (
    <Tab.Screen
        name={Screens.ChallengeStreaks}
        component={challengeStreakStack}
        options={() => ({
            title: 'Challenge',
            tabBarIcon: () => <FontAwesomeIcon icon={faMedal} />,
        })}
    />
);

const TeamStreaksTabScreen = (
    <Tab.Screen
        name={Screens.TeamStreaks}
        component={teamStreakStack}
        options={() => ({
            title: 'Team',
            tabBarIcon: () => <FontAwesomeIcon icon={faPeopleCarry} />,
        })}
    />
);

const SoloStreaksTabScreen = (
    <Tab.Screen
        name={Screens.SoloStreaks}
        component={soloStreakStack}
        options={() => ({
            title: 'Solo',
            tabBarIcon: () => <FontAwesomeIcon icon={faChild} />,
        })}
    />
);

export const StreakBottomTab = () => (
    <Tab.Navigator>
        {StreakTabScreen}
        {ChallengeStreaksTabScreen}
        {TeamStreaksTabScreen}
        {SoloStreaksTabScreen}
    </Tab.Navigator>
);
