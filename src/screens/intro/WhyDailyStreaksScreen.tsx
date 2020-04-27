import React from 'react';

import { Text, Button, Image } from 'react-native-elements';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Spacer } from '../../../components/Spacer';
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

class WhyDailyStreaksScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    render(): JSX.Element {
        return (
            <View style={styles.container}>
                <Spacer />
                <Spacer>
                    <Text h2 style={{ textAlign: 'center' }}>
                        Why daily streaks?
                    </Text>
                    <Text />
                    <Text>{`Performing tasks daily is the most effective way to build habits.`}</Text>
                    <Text />
                    <Text>{`If you know you're doing something everyday you can find a place for it in your routine. Making it simple to be consistent.`}</Text>
                </Spacer>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={{ uri: 'https://streakoid-images.s3-eu-west-1.amazonaws.com/logo.png' }}
                        style={{ width: 50, height: 50 }}
                        PlaceholderContent={<ActivityIndicator />}
                    />
                </View>
                <Spacer>
                    <Text
                        style={{ fontWeight: 'bold' }}
                    >{`Oid will check at midnight each day if you've completed your task`}</Text>
                </Spacer>
                <Spacer>
                    <Button title="Next" onPress={() => NavigationService.navigate(Screens.DifferentTypesOfStreaks)} />
                </Spacer>
            </View>
        );
    }
}

export { WhyDailyStreaksScreen };
