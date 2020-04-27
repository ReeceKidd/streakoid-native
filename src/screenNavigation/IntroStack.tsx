import { createStackNavigator } from 'react-navigation-stack';
import { WelcomeScreen } from '../screens/intro/WelcomeScreen';
import { WhatIsAStreakScreen } from '../screens/intro/WhatIsAStreakScreen';
import { WhyDailyStreaksScreen } from '../screens/intro/WhyDailyStreaksScreen';
import { DifferentTypesOfStreaksScreen } from '../screens/intro/DifferentTypesOfStreaksScreen';
import { StreakRecommendationsIntroScreen } from '../screens/intro/StreakRecommendationsIntroScreen';
import { CreateFirstStreakScreen } from '../screens/intro/CreateFirstStreakScreen';
import { DailyRemindersScreen } from '../screens/intro/DailyReminderScreen';

const IntroStack = createStackNavigator({
    Welcome: WelcomeScreen,
    WhatIsAStreak: WhatIsAStreakScreen,
    WhyDailyStreaks: WhyDailyStreaksScreen,
    DifferentTypesOfStreaks: DifferentTypesOfStreaksScreen,
    StreakRecommendationsIntro: StreakRecommendationsIntroScreen,
    DailyReminders: DailyRemindersScreen,
    CreateFirstStreak: CreateFirstStreakScreen,
});

export { IntroStack };
