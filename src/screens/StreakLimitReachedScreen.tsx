import React from 'react';

import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { Spacer } from '../../components/Spacer';
import { Linking } from 'expo';
import { FontAwesome5 } from '@expo/vector-icons';

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
                        Two Solo Streaks <FontAwesome5 name="child" size={20} style={{ color: 'blue' }} />
                    </Text>
                    <Text />
                    <Text style={{ fontWeight: 'bold' }}>
                        Two Team Streaks
                        <FontAwesome5 name="people-carry" size={20} style={{ textAlign: 'center', color: 'purple' }} />
                    </Text>
                    <Text />
                    <Text style={{ fontWeight: 'bold' }}>
                        Two Challenge Streaks <FontAwesome5 name="medal" size={20} style={{ color: 'navy' }} />
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
