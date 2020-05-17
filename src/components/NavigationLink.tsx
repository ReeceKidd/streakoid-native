import React, { PureComponent } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Screens } from '../screens/Screens';
import { Text } from 'react-native-elements';

interface NavigationLinkProps {
    text: string;
    screen: Screens;
}

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = NavigationLinkProps & NavigationProps;

const styles = StyleSheet.create({
    link: {
        color: 'blue',
    },
});

class NavigationLink extends PureComponent<Props> {
    render() {
        const { navigation, text, screen } = this.props;
        return (
            <TouchableOpacity onPress={() => navigation.navigate(screen)}>
                <Text style={styles.link}>{text}</Text>
            </TouchableOpacity>
        );
    }
}

export { NavigationLink };
