import React, { PureComponent } from 'react';

import { Text, Button } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';
import { Screens } from '../Screens';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBook, faBrain, faWeight } from '@fortawesome/pro-solid-svg-icons';
import { Spacer } from '../../components/Spacer';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../StackNavigator';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
    link: {
        color: 'blue',
    },
});

type WhatIsAStreakScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.WhatIsAStreak>;
type WhatIsAStreakScreenRouteProp = RouteProp<RootStackParamList, Screens.WhatIsAStreak>;

type NavigationProps = {
    navigation: WhatIsAStreakScreenNavigationProp;
    route: WhatIsAStreakScreenRouteProp;
};

class WhatIsAStreakScreen extends PureComponent<NavigationProps> {
    static navigationOptions = {
        header: null,
    };

    render(): JSX.Element {
        return (
            <View style={styles.container}>
                <Spacer>
                    <Text>{`Streaks are daily tasks which you define. They can be anything you want.`}</Text>
                </Spacer>
                <Spacer>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <FontAwesomeIcon icon={faBook} style={{ color: 'blue', marginRight: 5 }} />
                        <Text style={{ textAlign: 'center' }}>{`Reading`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <FontAwesomeIcon icon={faBrain} style={{ color: 'pink', marginRight: 5 }} />
                        <Text style={{ textAlign: 'center' }}>{`Meditation`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <FontAwesomeIcon icon={faWeight} style={{ color: 'green', marginRight: 5 }} />
                        <Text style={{ textAlign: 'center' }}>{`Exercise`}</Text>
                    </View>
                </Spacer>

                <Spacer>
                    <Button title="Next" onPress={() => this.props.navigation.push(Screens.WhyDailyStreaks)} />
                </Spacer>
            </View>
        );
    }
}

export { WhatIsAStreakScreen };
