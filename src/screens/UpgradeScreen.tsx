import React, { PureComponent } from 'react';

import { StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { Spacer } from '../components/Spacer';
import { Linking } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChild } from '@fortawesome/free-solid-svg-icons';
import { faPeopleCarry, faMedal, faLifeRing, faBan } from '@fortawesome/pro-solid-svg-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Screens } from './Screens';
import { RootStackParamList } from '../screenNavigation/RootNavigator';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

type UpgradeScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.Upgrade>;
type UpgradeScreenRouteProp = RouteProp<RootStackParamList, Screens.Upgrade>;

type NavigationProps = {
    navigation: UpgradeScreenNavigationProp;
    route: UpgradeScreenRouteProp;
};

class UpgradeScreen extends PureComponent<NavigationProps> {
    render(): JSX.Element {
        return (
            <ScrollView style={styles.container}>
                <Spacer>
                    <Text style={{ fontWeight: 'bold' }}>{`For those serious about building better habits.`}</Text>
                </Spacer>
                <Spacer>
                    <Text>
                        Unlimited Solo Streaks
                        <FontAwesomeIcon icon={faChild} style={{ color: 'blue' }} />
                    </Text>
                    <Text />
                    <Text>
                        Unlimited Team Streaks
                        <FontAwesomeIcon icon={faPeopleCarry} style={{ color: 'purple' }} />
                    </Text>
                    <Text />
                    <Text>
                        Unlimited Challenge Streaks
                        <FontAwesomeIcon icon={faMedal} style={{ color: 'navy' }} />
                    </Text>
                    <Text />
                    <Text>
                        Priority Support <FontAwesomeIcon icon={faLifeRing} style={{ color: 'darkblue' }} />
                    </Text>
                    <Text />
                    <Text>
                        No ads <FontAwesomeIcon icon={faBan} style={{ color: 'red' }} />
                    </Text>
                </Spacer>

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
