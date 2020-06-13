import React from 'react';
import { connect } from 'react-redux';

import { AppActions, AppState } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';

import { StyleSheet, View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Screens } from '../Screens';
import { soloStreakActions, userActions } from '../../actions/authenticatedSharedActions';
import { Spacer } from '../../components/Spacer';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { faUserCrown, faRocketLaunch } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NavigationService } from '../../../NavigationService';
import { RootStackParamList } from '../../screenNavigation/RootNavigator';

const mapStateToProps = (state: AppState) => {
    const createSoloStreakIsLoading = state && state.soloStreaks && state.soloStreaks.createSoloStreakIsLoading;
    const createSoloStreakErrorMessage = state && state.soloStreaks && state.soloStreaks.createSoloStreakErrorMessage;
    return {
        createSoloStreakIsLoading,
        createSoloStreakErrorMessage,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    createSoloStreak: bindActionCreators(soloStreakActions.createSoloStreak, dispatch),
    updateCurrentUser: bindActionCreators(userActions.updateCurrentUser, dispatch),
});

type TutorialCompleteScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.TutorialComplete>;
type TutorialCompleteScreenRouteProp = RouteProp<RootStackParamList, Screens.TutorialComplete>;

type NavigationProps = {
    navigation: TutorialCompleteScreenNavigationProp;
    route: TutorialCompleteScreenRouteProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class TutorialCompleteScreenComponent extends React.PureComponent<Props> {
    render(): JSX.Element {
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
                                    onPress={() => NavigationService.navigate({ screen: item.link })}
                                />
                            );
                        }}
                    />
                </Spacer>
            </View>
        );
    }
}

const TutorialCompleteScreen = connect(mapStateToProps, mapDispatchToProps)(TutorialCompleteScreenComponent);

export { TutorialCompleteScreen };
