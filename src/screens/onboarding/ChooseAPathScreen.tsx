import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../../store';

import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { View, StyleSheet } from 'react-native';
import { userActions } from '../../actions/authenticatedSharedActions';
import { Screens } from '../Screens';
import { faLifeRing, faUserCrown, faRocketLaunch, IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { ListItem } from 'react-native-elements';
import { Spacer } from '../../components/Spacer';
import { FlatList } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../screenNavigation/OnboardingStack';

const mapStateToProps = (state: AppState) => {
    const selectedChallengeStreak = state && state.challengeStreaks && state.challengeStreaks.selectedChallengeStreak;
    const challengeStreakId = selectedChallengeStreak && selectedChallengeStreak._id;
    const createNoteIsLoading = state && state.notes && state.notes.createNoteIsLoading;
    const createNoteErrorMessage = state && state.notes && state.notes.createNoteErrorMessage;
    return {
        challengeStreakId,
        selectedChallengeStreak,
        createNoteIsLoading,
        createNoteErrorMessage,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    updateCurrentUser: bindActionCreators(userActions.updateCurrentUser, dispatch),
});

type ChooseAPathScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, Screens.ChooseAPath>;

type NavigationProps = {
    navigation: ChooseAPathScreenNavigationProp;
};
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class ChooseAPathScreenComponent extends PureComponent<Props> {
    render(): JSX.Element {
        const confused = {
            _id: '1',
            link: Screens.WhatIsAStreak,
            name: 'Tutorial',
            subtitle: `If you're confused about Streakoid.`,
            icon: faLifeRing,
            color: 'red',
        };
        const customizeYourAccount = {
            _id: '2',
            link: Screens.WhatIsYourFirstName,
            name: 'Customize your account',
            subtitle: 'Make your account your own',
            icon: faUserCrown,
            color: 'gold',
        };
        const readyToTakeOnTheWorld = {
            _id: '3',
            link: Screens.Home,
            name: 'Ready to go',
            subtitle: 'Start building habits',
            icon: faRocketLaunch,
            color: 'blue',
        };
        const pathOptions: {
            _id: string;
            link: Screens;
            name: string;
            subtitle: string;
            icon: IconDefinition;
            color: string;
        }[] = [confused, customizeYourAccount, readyToTakeOnTheWorld];
        return (
            <View style={styles.container}>
                <Spacer>
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
                                    onPress={() => {
                                        this.props.updateCurrentUser({ updateData: { hasCompletedOnboarding: true } });
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        this.props.navigation.navigate(item.link as any);
                                    }}
                                />
                            );
                        }}
                    />
                </Spacer>
            </View>
        );
    }
}

const ChooseAPathScreen = connect(mapStateToProps, mapDispatchToProps)(ChooseAPathScreenComponent);

export { ChooseAPathScreen };
