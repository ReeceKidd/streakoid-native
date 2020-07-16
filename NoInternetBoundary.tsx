import React from 'react';
import NetInfo, { NetInfoSubscription } from '@react-native-community/netinfo';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Image, Text } from 'react-native-elements';
import { Spacer } from './src/components/Spacer';
import { OID_NO_INTERNET_IMAGE } from './src/images';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export class NoInternetBoundary extends React.PureComponent<{ children: unknown }> {
    state = { isInternetReachable: true };

    unsubscribe: NetInfoSubscription | undefined;

    componentDidMount() {
        this.unsubscribe = NetInfo.addEventListener((state) => {
            this.setState({ isInternetReachable: state.isInternetReachable });
        });
    }

    componentWillUnmount() {
        this.unsubscribe && this.unsubscribe();
    }

    render() {
        return this.state.isInternetReachable ? (
            this.props.children
        ) : (
            <SafeAreaView style={styles.container}>
                <Spacer />
                <View style={{ alignItems: 'center' }}>
                    <Image source={OID_NO_INTERNET_IMAGE} style={{ width: 300, height: 300 }} />
                </View>
                <Spacer>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Oid needs an internet connection to keep this show moving.
                    </Text>
                </Spacer>
                <Spacer />
            </SafeAreaView>
        );
    }
}
