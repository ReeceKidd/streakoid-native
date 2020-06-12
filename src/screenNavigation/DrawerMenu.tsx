import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { getDrawerOptions } from './drawerOptions';

const Drawer = createDrawerNavigator();

export const getDrawerMenu = ({
    isAuthenticated,
    isPayingMember,
}: {
    isAuthenticated: boolean;
    isPayingMember: boolean;
}) => <Drawer.Navigator>{getDrawerOptions({ isAuthenticated, isPayingMember })}</Drawer.Navigator>;
