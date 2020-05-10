import React from 'react';

import { StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { Spacer } from '../components/Spacer';
import { Linking } from 'react-native';
import { NavigationScreenProp, NavigationParams, NavigationState } from 'react-navigation';
import { HamburgerSelector } from '../components/HamburgerSelector';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChild } from '@fortawesome/free-solid-svg-icons';
import { faPeopleCarry, faMedal, faLifeRing, faBan } from '@fortawesome/pro-solid-svg-icons';

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
                <Text h4 style={{ textAlign: 'center' }}>
                    {`Upgrade if you're serious about achieving your goals.`}
                </Text>
                <Spacer />

                <Text style={{ textAlign: 'center' }}>
                    Unlimited Solo Streaks
                    <FontAwesomeIcon icon={faChild} style={{ color: 'blue' }} />
                </Text>
                <Text />
                <Text style={{ textAlign: 'center' }}>
                    Unlimited Team Streaks
                    <FontAwesomeIcon icon={faPeopleCarry} style={{ color: 'purple' }} />
                </Text>
                <Text />
                <Text style={{ textAlign: 'center' }}>
                    Unlimited Challenge Streaks
                    <FontAwesomeIcon icon={faMedal} style={{ color: 'navy' }} />
                </Text>
                <Text />
                <Text style={{ textAlign: 'center' }}>
                    Priority Support <FontAwesomeIcon icon={faLifeRing} style={{ color: 'darkblue' }} />
                </Text>
                <Text />
                <Text style={{ textAlign: 'center' }}>
                    No ads <FontAwesomeIcon icon={faBan} style={{ color: 'red' }} />
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
