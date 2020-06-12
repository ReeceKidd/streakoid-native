import React, { PureComponent } from 'react';

import { Text, Button } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';
import { Screens } from '../Screens';
import { Spacer } from '../../components/Spacer';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { TutorialStackParamList } from '../../screenNavigation/TutorialStack';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
    link: {
        color: 'blue',
    },
});

type WhyDailyStreaksScreenNavigationProp = StackNavigationProp<TutorialStackParamList, Screens.WhyDailyStreaks>;
type WhyDailyStreaksScreenRouteProp = RouteProp<TutorialStackParamList, Screens.WhyDailyStreaks>;

type NavigationProps = {
    navigation: WhyDailyStreaksScreenNavigationProp;
    route: WhyDailyStreaksScreenRouteProp;
};

class WhyDailyStreaksScreen extends PureComponent<NavigationProps> {
    static navigationOptions = {
        header: null,
    };

    render(): JSX.Element {
        return (
            <View style={styles.container}>
                <Spacer>
                    <Text>{`Performing tasks daily is the most effective way to build habits.`}</Text>
                    <Text />
                    <Text>{`If you know you're doing something everyday you can find a place for it in your routine. Making it simple to be consistent.`}</Text>
                </Spacer>
                <Spacer>
                    <Button title="Next" onPress={() => this.props.navigation.push(Screens.DifferentTypesOfStreaks)} />
                </Spacer>
            </View>
        );
    }
}

export { WhyDailyStreaksScreen };
