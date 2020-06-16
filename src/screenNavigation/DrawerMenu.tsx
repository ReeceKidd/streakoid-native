import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { getDrawerOptions } from './drawerOptions';

const Drawer = createDrawerNavigator();

export const getDrawerMenu = ({ isPayingMember }: { isPayingMember: boolean }) => (
    <Drawer.Navigator>{getDrawerOptions({ isPayingMember })}</Drawer.Navigator>
);
