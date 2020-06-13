import React, { PureComponent } from 'react';

import { Text, Button } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';
import { Screens } from '../Screens';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChild, faPeopleCarry, faMedal } from '@fortawesome/pro-solid-svg-icons';
import { Spacer } from '../../components/Spacer';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../screenNavigation/RootNavigator';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
    link: {
        color: 'blue',
    },
});

type DifferentTypesOfStreaksScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    Screens.DifferentTypesOfStreaks
>;
type DifferentTypesOfStreaksScreenRouteProp = RouteProp<RootStackParamList, Screens.DifferentTypesOfStreaks>;

type NavigationProps = {
    navigation: DifferentTypesOfStreaksScreenNavigationProp;
    route: DifferentTypesOfStreaksScreenRouteProp;
};

class DifferentTypesOfStreaksScreen extends PureComponent<NavigationProps> {
    static navigationOptions = {
        header: null,
    };

    render(): JSX.Element {
        return (
            <View style={styles.container}>
                <Spacer>
                    <View style={{ flexDirection: 'row' }}>
                        <FontAwesomeIcon icon={faChild} style={{ color: 'blue', marginRight: 5 }} />
                        <Text style={{ fontWeight: 'bold' }}> Solo Streaks </Text>
                    </View>

                    <Text>Just for you. Try to get your longest streak.</Text>
                    <Spacer />
                    <View style={{ flexDirection: 'row' }}>
                        <FontAwesomeIcon icon={faPeopleCarry} style={{ color: 'purple', marginRight: 5 }} />
                        <Text style={{ fontWeight: 'bold' }}>Team Streaks</Text>
                    </View>
                    <Text>
                        You and your friends are in it together. If one person loses the streak you all lose it.
                    </Text>
                    <Spacer />
                    <View style={{ flexDirection: 'row' }}>
                        <FontAwesomeIcon icon={faMedal} style={{ color: 'navy' }} />
                        <Text style={{ fontWeight: 'bold' }}> Challenge Streaks</Text>
                    </View>
                    <Text>Complete streaks with others around the globe.</Text>
                </Spacer>
                <Spacer>
                    <Button
                        title="Next"
                        onPress={() => this.props.navigation.push(Screens.StreakRecommendationsIntro)}
                    />
                </Spacer>
            </View>
        );
    }
}

export { DifferentTypesOfStreaksScreen };
