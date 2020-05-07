import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { ChallengesScreen } from '../screens/ChallengesScreen';
import { ChallengeInfoScreen } from '../screens/ChallengeInfoScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCrown } from '@fortawesome/pro-solid-svg-icons';

const ChallengesStack = createStackNavigator(
    {
        Challenges: ChallengesScreen,
        ChallengeInfo: ChallengeInfoScreen,
    },
    {
        navigationOptions: {
            title: 'Challenges',
            tabBarIcon: <FontAwesomeIcon icon={faCrown} />,
        },
    },
);

export { ChallengesStack };
