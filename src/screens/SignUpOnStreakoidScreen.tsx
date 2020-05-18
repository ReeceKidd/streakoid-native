import React, { PureComponent } from 'react';

import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Button, Image } from 'react-native-elements';
import { Spacer } from '../components/Spacer';
import { Linking } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
        alignItems: 'center',
    },
});

class SignUpOnStreakoidScreen extends PureComponent {
    static navigationOptions = {
        header: null,
        title: 'Gain access',
    };

    render(): JSX.Element {
        return (
            <View style={styles.container}>
                <Spacer />
                <Spacer>
                    <Text h3 style={{ textAlign: 'center' }}>
                        Try Streakoid for free with a 14 day trial
                    </Text>
                    <Text h4 style={{ textAlign: 'center' }}>
                        Then $4.99 a month. Cancel anytime
                    </Text>
                </Spacer>
                <Image
                    source={{ uri: 'https://streakoid-images.s3-eu-west-1.amazonaws.com/icon.png' }}
                    style={{ width: 200, height: 200 }}
                    PlaceholderContent={<ActivityIndicator />}
                />
                <Spacer>
                    <Text style={{ textAlign: 'center' }}>Oid only wants the best humans for the revolution.</Text>
                </Spacer>
                <Spacer>
                    <Button
                        title="Get access"
                        onPress={() => {
                            Linking.openURL('https://streakoid.com/register');
                        }}
                    ></Button>
                </Spacer>
                <Spacer />
            </View>
        );
    }
}

export { SignUpOnStreakoidScreen };
