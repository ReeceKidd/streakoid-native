/* eslint-disable react/display-name */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
    SoloStreakStackScreen,
    SoloStreakInfoStackScreen,
    CreateSoloStreakStackScreen,
    EditSoloStreakStackScreen,
    AddNoteToSoloStreakStackScreen,
    SoloStreakStackParamsList,
} from './SoloStreaksStack';
import {
    TeamStreaksStackScreen,
    TeamStreakInfoStackScreen,
    CreateTeamTeamStreakStackScreen,
    EditTeamTeamStreakStackScreen,
    AddFollowerToTeamTeamStreakStackScreen,
    TeamMemberStreakInfoStackScreen,
    AddNoteToTeamTeamStreakStackScreen,
    TeamStreakStackParamList,
} from './TeamStreaksStack';
import {
    AddNoteToChallengeStreaksStackScreen,
    ChallengeStreaksStackScreen,
    ChallengeStreakInfoStackScreen,
    ChallengeStreaksStackParamList,
} from './ChallengeStreaksStack';
import { Screens } from '../screens/Screens';
import { HomeScreen } from '../screens/HomeScreen';
import { HamburgerSelector } from '../components/HamburgerSelector';

type StreakStackParamList = { Home: undefined } & SoloStreakStackParamsList &
    ChallengeStreaksStackParamList &
    TeamStreakStackParamList;

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

const StreakStack = () => (
    <Stack.Navigator>
        {HomeStackScreen}
        {SoloStreakStackScreen}
        {SoloStreakInfoStackScreen}
        {CreateSoloStreakStackScreen}
        {EditSoloStreakStackScreen}
        {ChallengeStreaksStackScreen}
        {ChallengeStreakInfoStackScreen}
        {TeamStreaksStackScreen}
        {TeamStreakInfoStackScreen}
        {CreateTeamTeamStreakStackScreen}
        {EditTeamTeamStreakStackScreen}
        {AddFollowerToTeamTeamStreakStackScreen}
        {TeamMemberStreakInfoStackScreen}
        {AddNoteToSoloStreakStackScreen}
        {AddNoteToChallengeStreaksStackScreen}
        {AddNoteToTeamTeamStreakStackScreen}
    </Stack.Navigator>
);

export { StreakStack };
