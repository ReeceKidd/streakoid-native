import React from 'react';
import { Button } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/pro-solid-svg-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';

export const HamburgerSelector = () => {
    const navigation = useNavigation();
    return (
        <Button
            type="clear"
            icon={<FontAwesomeIcon icon={faBars} size={30} />}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
    );
};
