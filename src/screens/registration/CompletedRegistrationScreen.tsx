import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../../store';

import { View, StyleSheet } from 'react-native';
import { Spacer } from '../../components/Spacer';
import { Text, Button } from 'react-native-elements';
import { Screens } from '../Screens';
import { faRocketLaunch } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
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

        return (
            <View style={styles.container}>
                <RegistrationProgressBar currentUser={currentUser} />
                <Spacer>
                    <Text>You can now log in on all devices.</Text>
                    <Spacer />
                    <Button
                        title={'Finish'}
                        icon={<FontAwesomeIcon icon={faRocketLaunch} color={'white'} />}
                        onPress={() => this.props.navigation.popToTop()}
                    />
                </Spacer>
            </View>
        );
    }
}

const CompletedRegistrationScreen = connect(mapStateToProps)(CompletedRegistrationScreenComponent);

export { CompletedRegistrationScreen };
