/* eslint-disable react/display-name */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Screens } from '../screens/Screens';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarCheck, faPeopleCarry } from '@fortawesome/pro-solid-svg-icons';
import { StreakStack } from './StreakStack';
import { faMedal, faChild } from '@fortawesome/free-solid-svg-icons';
import { TeamStreaksStack } from './TeamStreaksStack';
import { ChallengeStreaksStack } from './ChallengeStreaksStack';
import { SoloStreaksStack } from './SoloStreaksStack';

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
        component={StreakStack}
        options={() => ({
            title: 'Streaks',
            tabBarIcon: () => <FontAwesomeIcon icon={faCalendarCheck} />,
        })}
    />
);

const ChallengeStreaksTabScreen = (
    <Tab.Screen
        name={Screens.ChallengeStreaks}
        component={ChallengeStreaksStack}
        options={() => ({
            title: 'Challenge Streaks',
            tabBarIcon: () => <FontAwesomeIcon icon={faMedal} />,
        })}
    />
);

const TeamStreaksTabScreen = (
    <Tab.Screen
        name={Screens.TeamStreaks}
        component={TeamStreaksStack}
        options={() => ({
            title: 'Team Streaks',
            tabBarIcon: () => <FontAwesomeIcon icon={faPeopleCarry} />,
        })}
    />
);

const SoloStreaksTabScreen = (
    <Tab.Screen
        name={Screens.SoloStreaks}
        component={SoloStreaksStack}
        options={() => ({
            title: 'Solo Streaks',
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
