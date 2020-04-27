import React from 'react';

import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { Spacer } from '../components/Spacer';
import { Linking } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChild, faPeopleCarry, faMedal } from '@fortawesome/pro-solid-svg-icons';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
        alignItems: 'center',
    },
});

class StreakLimitReachedScreen extends React.Component {
    static navigationOptions = {
        title: 'Streak Limit Reached',
    };

    render(): JSX.Element {
        return (
            <View style={styles.container}>
                <Spacer />
                <Spacer>
                    <Text h3 style={{ textAlign: 'center' }}>
                        Streak limit reached
                    </Text>
                    <Text />
                    <Text>{`Free accounts are allowed:`}</Text>
                    <Text />
                    <Text style={{ fontWeight: 'bold' }}>
                        Two Solo Streaks <FontAwesomeIcon icon={faChild} size={20} style={{ color: 'blue' }} />
                    </Text>
                    <Text />
                    <Text style={{ fontWeight: 'bold' }}>
                        Two Team Streaks
                        <FontAwesomeIcon icon={faPeopleCarry} size={20} style={{ color: 'purple' }} />
                    </Text>
                    <Text />
                    <Text style={{ fontWeight: 'bold' }}>
                        Two Challenge Streaks <FontAwesomeIcon icon={faMedal} size={20} style={{ color: 'navy' }} />
                    </Text>
                    <Text />
                    <Text>{`Upgrade for unlimited streaks.`}</Text>
                </Spacer>
                <Spacer>
                    <Button
                        title="Upgrade"
                        onPress={() => {
                            Linking.openURL('https://streakoid.com/upgrade');
                        }}
                    ></Button>
                </Spacer>
                <Spacer />
            </View>
        );
    }
}

export { StreakLimitReachedScreen };
