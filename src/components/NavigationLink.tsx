import React, { PureComponent } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Screens } from '../screens/Screens';
import { Text } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';

interface NavigationLinkProps {
    text: string;
    screen: Screens;
}

interface NavigationProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigation: StackNavigationProp<RootStackParamList, any>;
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <TouchableOpacity onPress={() => navigation.navigate(screen as any)}>
                <Text style={styles.link}>{text}</Text>
            </TouchableOpacity>
        );
    }
}

export { NavigationLink };
