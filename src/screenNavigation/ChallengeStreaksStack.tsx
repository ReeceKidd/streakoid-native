import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { ChallengeStreaksScreen } from '../screens/ChallengeStreaksScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMedal } from '@fortawesome/pro-solid-svg-icons';
import { ChallengeStreakInfoScreen } from '../screens/ChallengeStreakInfoScreen';
import { AddNoteToChallengeStreakScreen } from '../screens/AddNoteToChallengeStreakScreen';

const ChallengeStreakStack = createStackNavigator(
    {
        ChallengeStreaks: ChallengeStreaksScreen,
        ChallengeStreakInfo: ChallengeStreakInfoScreen,
        AddNoteToChallengeStreak: AddNoteToChallengeStreakScreen,
    },
    {
        navigationOptions: {
            title: 'Challenge Streaks',
            tabBarIcon: <FontAwesomeIcon icon={faMedal} />,
        },
    },
);

export { ChallengeStreakStack };
