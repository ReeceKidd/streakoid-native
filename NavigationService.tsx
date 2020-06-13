/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { Screens } from './src/screens/Screens';
import { DrawerActions } from '@react-navigation/native';

export const navigationRef = React.createRef();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const navigate = ({ screen, params }: { screen: Screens; params?: Record<any, any> }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigationRef && navigationRef.current && (navigationRef.current as any).navigate(screen, params);
};

const openDrawer = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigationRef && navigationRef.current && (navigationRef.current as any).dispatch(DrawerActions.openDrawer());
};

export const NavigationService = {
    navigate,
    openDrawer,
};
