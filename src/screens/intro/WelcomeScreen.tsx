import React from 'react';

import { Text, Image, Button } from 'react-native-elements';
import { Spacer } from '../../../components/Spacer';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import NavigationService from '../NavigationService';
import { Screens } from '../Screens';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
    link: {
        color: 'blue',
    },
});

class WelcomeScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    render(): JSX.Element {
        return (
            <View style={styles.container}>
                <Spacer />
                <Spacer>
                    <Text h2 style={{ textAlign: 'center' }}>
                        Welcome to Streakoid
                    </Text>
                </Spacer>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={{ uri: 'https://streakoid-images.s3-eu-west-1.amazonaws.com/icon.png' }}
                        style={{ width: 150, height: 150 }}
                        PlaceholderContent={<ActivityIndicator />}
                    />
                </View>
                <Spacer>
                    <Text h4 style={{ textAlign: 'center' }}>{`You're in Oid's good books for now.`}</Text>
                </Spacer>
                <Spacer>
                    <Button title="Get started" onPress={() => NavigationService.navigate(Screens.WhatIsAStreak)} />
                </Spacer>
            </View>
        );
    }
}

export { WelcomeScreen };
