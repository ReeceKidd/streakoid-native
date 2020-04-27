import { createBottomTabNavigator } from 'react-navigation-tabs';
import { SoloStreakStack } from './SoloStreakStack';
import { UserStack } from './UserStack';
import { TeamStreakStack } from './TeamStreaksStack';

const BottomTabNavigator = createBottomTabNavigator({
    SoloStreaks: SoloStreakStack,
    TeamStreaks: TeamStreakStack,
    Users: UserStack,
});

export { BottomTabNavigator };
