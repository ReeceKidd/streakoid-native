import React from 'react';

import { Text, Button } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';
import NavigationService from '../NavigationService';
import { Screens } from '../Screens';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChild, faPeopleCarry, faMedal } from '@fortawesome/pro-solid-svg-icons';
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

class DifferentTypesOfStreaksScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    render(): JSX.Element {
        return (
            <View style={styles.container}>
                <Spacer />
                <Spacer>
                    <Text h4 style={{ textAlign: 'center' }}>
                        Complete streaks by yourself, with friends or compete with others across the globe.
                    </Text>
                    <Spacer />
                    <FontAwesomeIcon icon={faChild} style={{ color: 'blue' }} />
                    <Text h4> Solo Streaks </Text>
                    <Text>Just for you. Try to get your longest streak.</Text>
                    <Spacer />
                    <FontAwesomeIcon icon={faPeopleCarry} style={{ color: 'purple' }} />
                    <Text h4>Team Streaks</Text>
                    <Text>
                        You and your friends are in it together. If one person loses the streak you all lose it.
                    </Text>
                    <Spacer />
                    <FontAwesomeIcon icon={faMedal} style={{ color: 'navy' }} />
                    <Text h4> Challenge Streaks</Text>
                    <Text>Complete streaks with others around the globe.</Text>
                </Spacer>
                <Spacer>
                    <Button
                        title="Next"
                        onPress={() => NavigationService.navigate(Screens.StreakRecommendationsIntro)}
                    />
                </Spacer>
            </View>
        );
    }
}

export { DifferentTypesOfStreaksScreen };
