import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/pro-solid-svg-icons';

interface HamburgerSelectorProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigation: any;
}

class HamburgerSelector extends Component<HamburgerSelectorProps> {
    render() {
        const { navigation } = this.props;
        return (
            <Button
                type="clear"
                icon={<FontAwesomeIcon icon={faBars} size={30} />}
                onPress={() => navigation.openDrawer()}
            />
        );
    }
}

export { HamburgerSelector };
