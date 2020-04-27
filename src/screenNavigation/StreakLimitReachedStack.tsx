import { createStackNavigator } from 'react-navigation-stack';
import { StreakLimitReachedScreen } from '../screens/StreakLimitReachedScreen';

const StreakLimitReachedStack = createStackNavigator({
    StreakLimitReached: StreakLimitReachedScreen,
});

export { StreakLimitReachedStack };
