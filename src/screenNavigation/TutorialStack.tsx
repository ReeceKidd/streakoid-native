/* eslint-disable react/display-name */
import React from 'react';
import { WhatIsAStreakScreen } from '../screens/tutorial/WhatIsAStreakScreen';
import { WhyDailyStreaksScreen } from '../screens/tutorial/WhyDailyStreaksScreen';
import { DifferentTypesOfStreaksScreen } from '../screens/tutorial/DifferentTypesOfStreaksScreen';
import { StreakRecommendationsIntroScreen } from '../screens/tutorial/StreakRecommendationsIntroScreen';
import { TutorialCompleteScreen } from '../screens/tutorial/TutorialCompleteScreen';
import { DailyReminderScreen } from '../screens/tutorial/DailyReminderScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../screens/Screens';

export type TutorialStackParamList = {
    WhatIsAStreak: undefined;
    WhyDailyStreaks: undefined;
    DifferentTypesOfStreaks: undefined;
    StreakRecommendationsIntro: undefined;
    DailyReminders: undefined;
    TutorialComplete: undefined;
};

const Stack = createStackNavigator<TutorialStackParamList>();

export const WhatIsAStreakStackScreen = (
    <Stack.Screen
        name={Screens.WhatIsAStreak}
        options={{ title: 'What is a Streak?', headerLeft: () => null }}
        component={WhatIsAStreakScreen}
    />
);

export const WhyDailyStreaksStackScreen = (
    <Stack.Screen
        name={Screens.WhyDailyStreaks}
        options={{ title: 'Why daily streaks?', headerLeft: () => null }}
        component={WhyDailyStreaksScreen}
    />
);

export const DifferentTypesOfStreaksStackScreen = (
    <Stack.Screen
        name={Screens.DifferentTypesOfStreaks}
        options={{ title: 'Different types of streaks', headerLeft: () => null }}
        component={DifferentTypesOfStreaksScreen}
    />
);

export const StreakRecommendationsIntroStackScreen = (
    <Stack.Screen
        name={Screens.StreakRecommendationsIntro}
        options={{ title: 'Streak Recommendations', headerLeft: () => null }}
        component={StreakRecommendationsIntroScreen}
    />
);

export const DailyRemindersStackScreen = (
    <Stack.Screen
        name={Screens.DailyReminders}
        options={{ title: 'Daily Reminders', headerLeft: () => null }}
        component={DailyReminderScreen}
    />
);

export const TutorialCompleteStackScreen = (
    <Stack.Screen
        name={Screens.TutorialComplete}
        options={{ title: 'Tutorial Complete', headerLeft: () => null }}
        component={TutorialCompleteScreen}
    />
);

export const TutorialStack = () => (
    <Stack.Navigator>
        {WhatIsAStreakStackScreen}
        {WhyDailyStreaksStackScreen}
        {DifferentTypesOfStreaksStackScreen}
        {StreakRecommendationsIntroStackScreen}
        {DailyRemindersStackScreen}
        {TutorialCompleteStackScreen}
    </Stack.Navigator>
);
