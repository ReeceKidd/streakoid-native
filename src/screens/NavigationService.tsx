/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavigationActions } from 'react-navigation';
import { Screens } from './Screens';

let navigator: any;

const setTopLevelNavigator = (navigatorRef: any) => {
    navigator = navigatorRef;
};

const navigate = (screen: Screens | string, params?: object) => {
    navigator.dispatch(
        NavigationActions.navigate({
            routeName: screen,
            params,
        }),
    );
};

export default {
    navigate,
    setTopLevelNavigator,
};
