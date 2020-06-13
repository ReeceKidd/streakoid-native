import React, { PureComponent } from 'react';

import { StyleSheet, ScrollView, ActivityIndicator, View } from 'react-native';
import { Button, Image, Text } from 'react-native-elements';
import { Spacer } from '../components/Spacer';
import { Screens } from './Screens';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

type LandingScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.Landing>;

type Props = {
    navigation: LandingScreenNavigationProp;
};

class LandingScreen extends PureComponent<Props> {
    render(): JSX.Element {
        return (
            <ScrollView style={styles.container}>
                <Spacer />
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={{ uri: 'https://streakoid-images.s3-eu-west-1.amazonaws.com/icon.png' }}
                        style={{ width: 200, height: 200 }}
                        PlaceholderContent={<ActivityIndicator />}
                    />
                </View>
                <Spacer>
                    <Text h2 style={{ textAlign: 'center' }}>
                        Streakoid
                    </Text>
                </Spacer>
                <Spacer>
                    <Text style={{ textAlign: 'center' }}>Build daily habits with people around the globe.</Text>
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
            </ScrollView>
        );
    }
}

export { LandingScreen };
