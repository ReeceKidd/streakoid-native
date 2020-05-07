import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMailBulk } from '@fortawesome/pro-solid-svg-icons';
import { createStackNavigator } from 'react-navigation-stack';
import { FeedbackScreen } from '../screens/FeedbackScreen';

const FeedbackStack = createStackNavigator(
    {
        Feedback: FeedbackScreen,
    },
    {
        navigationOptions: {
            title: 'Feedback ',
            tabBarIcon: <FontAwesomeIcon icon={faMailBulk} />,
        },
    },
);

export { FeedbackStack };
