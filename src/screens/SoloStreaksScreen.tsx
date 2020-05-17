import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationState, NavigationParams, ScrollView } from 'react-navigation';
import { Button, Text } from 'react-native-elements';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { View, StyleSheet, AppState as ReactNativeAppState } from 'react-native';

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
import { MaximumNumberOfFreeStreaksMessage } from '../components/MaximumNumberOfFreeStreaksMessage';
import { MAXIMUM_NUMBER_OF_FREE_STREAKS } from '../../config';

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
    const totalLiveStreaks = currentUser && currentUser.totalLiveStreaks;
    const isPayingMember =
        currentUser && currentUser.membershipInformation && currentUser.membershipInformation.isPayingMember;
    return {
        currentUser,
        getSoloStreakIsLoading,
        liveSoloStreaks,
        getMultipleLiveSoloStreaksIsLoading,
        archivedSoloStreaks,
        getMultipleArchivedSoloStreaksIsLoading,
        totalNumberOfSoloStreaks,
        isPayingMember,
        totalLiveStreaks,
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

class SoloStreaksScreenComponent extends PureComponent<Props> {
    static navigationOptions = ({
        navigation,
    }: {
        navigation: NavigationScreenProp<NavigationState, { isPayingMember: boolean; totalLiveStreaks: number }>;
    }) => {
        const isPayingMember = navigation.getParam('isPayingMember');
        const totalLiveStreaks = navigation.getParam('totalLiveStreaks');
        const userHasReachedFreeStreakLimit = !isPayingMember && totalLiveStreaks > MAXIMUM_NUMBER_OF_FREE_STREAKS;
        return {
            title: 'Solo Streaks',
            headerRight: (
                <Button
                    type="clear"
                    icon={<FontAwesomeIcon icon={faPlus} size={30} />}
                    onPress={() => {
                        if (!userHasReachedFreeStreakLimit) {
                            return NavigationService.navigate(Screens.CreateSoloStreak);
                        }
                        NavigationService.navigate(Screens.Upgrade);
                    }}
                />
            ),
            headerLeft: () => <HamburgerSelector navigation={navigation} />,
        };
    };

    componentDidMount() {
        const { isPayingMember, totalLiveStreaks } = this.props;
        this.props.navigation.setParams({ isPayingMember, totalLiveStreaks });
        ReactNativeAppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        ReactNativeAppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState: string) => {
        if (nextAppState === 'active') {
            this.props.getLiveSoloStreaks();
        }
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
            isPayingMember,
        } = this.props;
        const totalLiveStreaks = currentUser && currentUser.totalLiveStreaks;
        return (
            <ScrollView style={styles.container}>
                <View>
                    {!isPayingMember ? (
                        <View style={{ marginLeft: 15, marginTop: 15 }}>
                            <MaximumNumberOfFreeStreaksMessage
                                isPayingMember={isPayingMember}
                                totalLiveStreaks={totalLiveStreaks}
                            />
                        </View>
                    ) : null}
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
