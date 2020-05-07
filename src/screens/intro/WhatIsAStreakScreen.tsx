import React from 'react';

import { Text, Button } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';
import NavigationService from '../NavigationService';
import { Screens } from '../Screens';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBook, faBrain, faWeight } from '@fortawesome/pro-solid-svg-icons';
import { Spacer } from '../../components/Spacer';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
    link: {
        color: 'blue',
    },
});

class WhatIsAStreakScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    render(): JSX.Element {
        return (
            <View style={styles.container}>
                <Spacer />
                <Spacer>
                    <Text h2 style={{ textAlign: 'center' }}>
                        What is a streak?
                    </Text>
                    <Spacer />
                    <Text>{`Streaks are daily tasks which you define. They can be anything you want..`}</Text>
                </Spacer>
                <Spacer>
                    <Text h4 style={{ textAlign: 'center' }}>{`Reading`}</Text>
                    <FontAwesomeIcon icon={faBook} style={{ color: 'blue' }} />
                    <Text h4 style={{ textAlign: 'center' }}>{`Meditation`}</Text>
                    <FontAwesomeIcon icon={faBrain} style={{ color: 'pink' }} />
                    <Text h4 style={{ textAlign: 'center' }}>{`Exercise`}</Text>
                    <FontAwesomeIcon icon={faWeight} style={{ color: 'green' }} />
                </Spacer>

                <Spacer>
                    <Button title="Next" onPress={() => NavigationService.navigate(Screens.WhyDailyStreaks)} />
                </Spacer>
            </View>
        );
    }
}

export { WhatIsAStreakScreen };
