import { createStackNavigator } from 'react-navigation-stack';
import { StreakRecommendationsScreen } from '../screens/StreakRecommendationsScreen';

const StreakRecommendationsStack = createStackNavigator({
    StreakRecommendationss: StreakRecommendationsScreen,
});

export { StreakRecommendationsStack };
