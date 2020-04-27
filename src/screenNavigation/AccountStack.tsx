import { createStackNavigator } from 'react-navigation-stack';
import { AccountScreen } from '../screens/AccountScreen';

const AccountStack = createStackNavigator({
    Accounts: AccountScreen,
});

export { AccountStack };
