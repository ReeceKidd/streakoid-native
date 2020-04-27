import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { SoloStreaksScreen } from '../screens/SoloStreaksScreen';
import { SoloStreakInfoScreen } from '../screens/SoloStreakInfoScreen';
import { CreateSoloStreakScreen } from '../screens/CreateSoloStreakScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChild } from '@fortawesome/pro-solid-svg-icons';
import { EditSoloStreakScreen } from '../screens/EditSoloStreakScreen';
import { AddNoteToSoloStreakScreen } from '../screens/AddNoteToSoloStreakScreen';

const SoloStreakStack = createStackNavigator(
    {
        SoloStreaks: SoloStreaksScreen,
        SoloStreakInfo: SoloStreakInfoScreen,
        CreateSoloStreak: CreateSoloStreakScreen,
        EditSoloStreak: EditSoloStreakScreen,
        AddNoteToSoloStreak: AddNoteToSoloStreakScreen,
    },
    {
        navigationOptions: {
            title: 'Solo Streaks',
            tabBarIcon: <FontAwesomeIcon icon={faChild} size={20} />,
        },
    },
);

export { SoloStreakStack };
