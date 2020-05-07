import React, { Component } from 'react';

import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationState, NavigationParams, ScrollView } from 'react-navigation';
import { Button, Text } from 'react-native-elements';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { View, StyleSheet } from 'react-native';

import { soloStreakActions, userActions } from '../actions/sharedActions';
import { AppState } from '../../store';
import { Spacer } from '../components/Spacer';
import { LiveSoloStreakList } from '../components/LiveSoloStreakList';
import NavigationService from './NavigationService';
import { Screens } from './Screens';
import { HamburgerSelector } from '../components/HamburgerSelector';
import { ArchivedSoloStreakList } from '../components/ArchivedSoloStreakList';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faArchive } from '@fortawesome/free-solid-svg-icons';

const mapStateToProps = (state: AppState) => {
    const currentUser = state && state.users && state.users.currentUser;
    const liveSoloStreaks =
        state && state.soloStreaks && state.soloStreaks.liveSoloStreaks && state.soloStreaks.liveSoloStreaks;
    const getSoloStreakIsLoading = state && state.soloStreaks && state.soloStreaks.getSoloStreakIsLoading;
    const getMultipleLiveSoloStreaksIsLoading =
        state && state.soloStreaks && state.soloStreaks.getMultipleLiveSoloStreaksIsLoading;
    const archivedSoloStreaks = state && state.soloStreaks && state.soloStreaks.archivedSoloStreaks;
    const getMultipleArchivedSoloStreaksIsLoading =
        state && state.soloStreaks && state.soloStreaks.getMultipleArchivedSoloStreaksIsLoading;
    const totalNumberOfSoloStreaks = liveSoloStreaks.length;
    return {
        currentUser,
        getSoloStreakIsLoading,
        liveSoloStreaks,
        getMultipleLiveSoloStreaksIsLoading,
        archivedSoloStreaks,
        getMultipleArchivedSoloStreaksIsLoading,
        totalNumberOfSoloStreaks,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    updateCurrentUser: bindActionCreators(userActions.updateCurrentUser, dispatch),
    getLiveSoloStreaks: bindActionCreators(soloStreakActions.getLiveSoloStreaks, dispatch),
    getSoloStreak: bindActionCreators(soloStreakActions.getSoloStreak, dispatch),
    completeSoloStreakListTask: bindActionCreators(soloStreakActions.completeSoloStreakListTask, dispatch),
    incompleteSoloStreakListTask: bindActionCreators(soloStreakActions.incompleteSoloStreakListTask, dispatch),
    getArchivedSoloStreaks: bindActionCreators(soloStreakActions.getArchivedSoloStreaks, dispatch),
});

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    NavigationProps & { isFocused: boolean };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class SoloStreaksScreenComponent extends Component<Props> {
    static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationState, {}> }) => {
        return {
            title: 'Solo Streaks',
            headerRight: (
                <Button
                    type="clear"
                    icon={<FontAwesomeIcon icon={faPlus} size={30} />}
                    onPress={() => NavigationService.navigate(Screens.CreateSoloStreak)}
                />
            ),
            headerLeft: () => <HamburgerSelector navigation={navigation} />,
        };
    };

    render(): JSX.Element {
        const {
            currentUser,
            liveSoloStreaks,
            getSoloStreak,
            getLiveSoloStreaks,
            getArchivedSoloStreaks,
            archivedSoloStreaks,
            completeSoloStreakListTask,
            incompleteSoloStreakListTask,
            getMultipleLiveSoloStreaksIsLoading,
            getMultipleArchivedSoloStreaksIsLoading,
            totalNumberOfSoloStreaks,
        } = this.props;
        return (
            <ScrollView style={styles.container}>
                <View>
                    <Spacer>
                        <LiveSoloStreakList
                            userId={currentUser._id}
                            navigation={this.props.navigation}
                            getSoloStreak={getSoloStreak}
                            getLiveSoloStreaks={getLiveSoloStreaks}
                            completeSoloStreakListTask={completeSoloStreakListTask}
                            incompleteSoloStreakListTask={incompleteSoloStreakListTask}
                            liveSoloStreaks={liveSoloStreaks}
                            getMultipleLiveSoloStreaksIsLoading={getMultipleLiveSoloStreaksIsLoading}
                            totalNumberOfSoloStreaks={totalNumberOfSoloStreaks}
                        />
                    </Spacer>
                    <Spacer>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                            Archived Solo Streaks <FontAwesomeIcon icon={faArchive} />
                        </Text>
                        <ArchivedSoloStreakList
                            getArchivedSoloStreaks={getArchivedSoloStreaks}
                            archivedSoloStreaks={archivedSoloStreaks}
                            getMultipleArchivedSoloStreaksIsLoading={getMultipleArchivedSoloStreaksIsLoading}
                            navigation={this.props.navigation}
                        />
                    </Spacer>
                </View>
            </ScrollView>
        );
    }
}

const SoloStreaksScreen = connect(mapStateToProps, mapDispatchToProps)(SoloStreaksScreenComponent);

export { SoloStreaksScreen };
