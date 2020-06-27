import React, { PureComponent } from 'react';

import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Button, Image, Text } from 'react-native-elements';
import { Spacer } from '../components/Spacer';
import { Screens } from './Screens';

import { StackNavigationProp } from '@react-navigation/stack';
import { UnauthenticatedStackParamList } from '../screenNavigation/UnauthenticatedStack';
import { OID_IMAGE } from '../images';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

type LandingScreenNavigationProp = StackNavigationProp<UnauthenticatedStackParamList, Screens.Landing>;

type Props = {
    navigation: LandingScreenNavigationProp;
};

class LandingScreen extends PureComponent<Props> {
    render(): JSX.Element {
        return (
            <SafeAreaView style={styles.container}>
                <Spacer />
                <View style={{ alignItems: 'center' }}>
                    <Image source={OID_IMAGE} style={{ width: 200, height: 200 }} />
                </View>
                <Spacer>
                    <Text h2 style={{ textAlign: 'center' }}>
                        Streakoid
                    </Text>
                </Spacer>
                <Spacer>
                    <Text style={{ textAlign: 'center' }}>Build habits with friends.</Text>
                </Spacer>
                <Spacer />
                <Spacer>
                    <Button
                        title="Get started"
                        onPress={() => {
                            this.props.navigation.navigate(Screens.MadeAnAccount);
                        }}
                    ></Button>
                </Spacer>

                <Spacer>
                    <Button
                        title="Login"
                        type="clear"
                        onPress={() => {
                            this.props.navigation.navigate(Screens.Login);
                        }}
                    ></Button>
                </Spacer>
            </SafeAreaView>
        );
    }
}

export { LandingScreen };
