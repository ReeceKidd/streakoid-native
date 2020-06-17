import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { getDrawerOptions } from './drawerOptions';

const Drawer = createDrawerNavigator();

export const getDrawerMenu = ({
    isPayingMember,
    platformIsIOS,
}: {
    isPayingMember: boolean;
    platformIsIOS: boolean;
}) => <Drawer.Navigator>{getDrawerOptions({ isPayingMember, platformIsIOS })}</Drawer.Navigator>;
