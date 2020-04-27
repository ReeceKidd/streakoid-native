import React from 'react';

import { StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { Spacer } from '../../components/Spacer';
import { Linking } from 'expo';
import { FontAwesome5 } from '@expo/vector-icons';
import { NavigationScreenProp, NavigationParams, NavigationState } from 'react-navigation';
import { HamburgerSelector } from '../../components/HamburgerSelector';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

class UpgradeScreen extends React.Component<NavigationProps> {
    static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationState, {}> }) => {
        return {
            headerLeft: () => <HamburgerSelector navigation={navigation} />,
        };
    };

    render(): JSX.Element {
        return (
            <ScrollView style={styles.container}>
                <Spacer />
                <Text h3 style={{ textAlign: 'center' }}>
                    Upgrade for:
                </Text>
                <Spacer />

                <Text style={{ textAlign: 'center' }}>
                    Unlimited Solo Streaks
                    <FontAwesome5 name="child" size={20} style={{ textAlign: 'center', color: 'blue' }} />
                </Text>
                <Text />
                <Text style={{ textAlign: 'center' }}>
                    Unlimited Team Streaks
                    <FontAwesome5 name="people-carry" size={20} style={{ textAlign: 'center', color: 'purple' }} />
                </Text>
                <Text />
                <Text style={{ textAlign: 'center' }}>
                    Unlimited Challenge Streaks
                    <FontAwesome5 name="medal" size={20} style={{ textAlign: 'center', color: 'navy' }} />
                </Text>
                <Text />
                <Text style={{ textAlign: 'center' }}>
                    Priority Support{' '}
                    <FontAwesome5 name="life-ring" size={20} style={{ textAlign: 'center', color: 'darkblue' }} />
                </Text>
                <Text />
                <Text style={{ textAlign: 'center' }}>
                    No ads <FontAwesome5 name="ban" size={20} style={{ textAlign: 'center', color: 'red' }} />
                </Text>
                <Text />
                <Spacer>
                    <Button
                        title="Upgrade"
                        onPress={() => {
                            Linking.openURL('https://streakoid.com/upgrade');
                        }}
                    ></Button>
                </Spacer>
            </ScrollView>
        );
    }
}

export { UpgradeScreen };
