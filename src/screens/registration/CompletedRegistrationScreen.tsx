import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../../store';

import { View, StyleSheet } from 'react-native';
import { Spacer } from '../../components/Spacer';
import { Text, ListItem } from 'react-native-elements';
import { Screens } from '../Screens';
import { faUserCrown, faRocketLaunch } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { FlatList } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../screenNavigation/RootNavigator';
import { RegistrationProgressBar } from '../../components/RegistrationProgressBar';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    return {
        currentUser,
    };
};

type CompletedRegistrationScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.CompletedRegistration>;

type NavigationProps = {
    navigation: CompletedRegistrationScreenNavigationProp;
};

type Props = ReturnType<typeof mapStateToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class CompletedRegistrationScreenComponent extends PureComponent<Props> {
    render(): JSX.Element {
        const { currentUser } = this.props;
        const customizeYourAccount = {
            _id: '1',
            link: Screens.WhatIsYourFirstName,
            name: 'Customize your account',
            subtitle: 'Make your account your own',
            icon: faUserCrown,
            color: 'gold',
        };
        const readyToTakeOnTheWorld = {
            _id: '2',
            link: Screens.Home,
            name: 'Ready to go',
            subtitle: 'Start building habits',
            icon: faRocketLaunch,
            color: 'blue',
        };
        const pathOptions = [customizeYourAccount, readyToTakeOnTheWorld];
        return (
            <View style={styles.container}>
                <RegistrationProgressBar currentUser={currentUser} />
                <Spacer>
                    <Text>You can now log in on all devices.</Text>
                    <FlatList
                        data={pathOptions}
                        keyExtractor={(option) => option._id}
                        renderItem={({ item }) => {
                            return (
                                <ListItem
                                    leftIcon={<FontAwesomeIcon icon={item.icon} color={item.color} />}
                                    title={item.name}
                                    subtitle={item.subtitle}
                                    chevron={true}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    onPress={() => this.props.navigation.navigate(item.link as any)}
                                />
                            );
                        }}
                    />
                </Spacer>
            </View>
        );
    }
}

const CompletedRegistrationScreen = connect(mapStateToProps)(CompletedRegistrationScreenComponent);

export { CompletedRegistrationScreen };
