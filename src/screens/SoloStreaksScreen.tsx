import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { Text } from 'react-native-elements';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { View, StyleSheet, AppState as ReactNativeAppState } from 'react-native';

import { soloStreakActions, userActions } from '../actions/authenticatedSharedActions';
import { AppState } from '../../store';
import { Spacer } from '../components/Spacer';
import { LiveSoloStreakList } from '../components/LiveSoloStreakList';
import { Screens } from './Screens';
import { ArchivedSoloStreakList } from '../components/ArchivedSoloStreakList';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArchive } from '@fortawesome/free-solid-svg-icons';
import { MaximumNumberOfFreeStreaksMessage } from '../components/MaximumNumberOfFreeStreaksMessage';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { ProgressBar } from '../components/ProgressBar';
import { getCompletePercentageForStreaks } from '../helpers/getCompletePercentageForStreaks';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../screenNavigation/RootNavigator';

const getIncompleteSoloStreaks = (state: AppState) => {
    return (
        state &&
        state.soloStreaks &&
        state.soloStreaks.liveSoloStreaks &&
        state.soloStreaks.liveSoloStreaks.filter(
            (soloStreak) => !soloStreak.completedToday && soloStreak.status === StreakStatus.live,
        )
    );
};

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
    const incompleteSoloStreaks = getIncompleteSoloStreaks(state);
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
        incompleteSoloStreaks,
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

type SoloStreaksScreenNavigationProp = StackNavigationProp<RootStackParamList, Screens.SoloStreaks>;
type SoloStreaksScreenRouteProp = RouteProp<RootStackParamList, Screens.SoloStreaks>;

type NavigationProps = {
    navigation: SoloStreaksScreenNavigationProp;
    route: SoloStreaksScreenRouteProp;
};

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
    componentDidMount() {
        this.props.getLiveSoloStreaks();
        this.props.getArchivedSoloStreaks();
        const { isPayingMember, totalLiveStreaks } = this.props;
        this.props.navigation.setParams({ isPayingMember, totalLiveStreaks });
        ReactNativeAppState.addEventListener('change', this._handleAppStateChange);
    }

    componentDidUpdate(prevProps: Props) {
        const { getMultipleLiveSoloStreaksIsLoading } = this.props;
        if (prevProps.getMultipleLiveSoloStreaksIsLoading !== getMultipleLiveSoloStreaksIsLoading) {
            this.props.navigation.setParams({ getMultipleLiveSoloStreaksIsLoading });
        }
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
            archivedSoloStreaks,
            completeSoloStreakListTask,
            incompleteSoloStreakListTask,
            getMultipleLiveSoloStreaksIsLoading,
            getMultipleArchivedSoloStreaksIsLoading,
            totalNumberOfSoloStreaks,
            isPayingMember,
            incompleteSoloStreaks,
        } = this.props;
        const totalLiveStreaks = currentUser && currentUser.totalLiveStreaks;
        return (
            <ScrollView style={styles.container}>
                <View>
                    <ProgressBar
                        completePercentage={getCompletePercentageForStreaks({
                            numberOfIncompleteStreaks: incompleteSoloStreaks.length,
                            numberOfStreaks: totalNumberOfSoloStreaks,
                        })}
                        fullScreen={true}
                    />
                    {!isPayingMember ? (
                        <View style={{ marginLeft: 15, marginTop: 15 }}>
                            <MaximumNumberOfFreeStreaksMessage
                                isPayingMember={isPayingMember}
                                totalLiveStreaks={totalLiveStreaks}
                            />
                        </View>
                    ) : null}

                    <View style={{ marginLeft: 15, marginRight: 15, marginBottom: 15 }}>
                        <LiveSoloStreakList
                            userId={currentUser._id}
                            navigation={this.props.navigation}
                            getSoloStreak={getSoloStreak}
                            completeSoloStreakListTask={completeSoloStreakListTask}
                            incompleteSoloStreakListTask={incompleteSoloStreakListTask}
                            liveSoloStreaks={liveSoloStreaks}
                            getMultipleLiveSoloStreaksIsLoading={getMultipleLiveSoloStreaksIsLoading}
                            totalNumberOfSoloStreaks={totalNumberOfSoloStreaks}
                        />
                    </View>
                    <Spacer>
                        <Text style={{ fontWeight: 'bold' }}>
                            Archived Solo Streaks <FontAwesomeIcon icon={faArchive} />
                        </Text>
                        <ArchivedSoloStreakList
                            navigation={this.props.navigation}
                            archivedSoloStreaks={archivedSoloStreaks}
                            getMultipleArchivedSoloStreaksIsLoading={getMultipleArchivedSoloStreaksIsLoading}
                        />
                    </Spacer>
                </View>
            </ScrollView>
        );
    }
}

const SoloStreaksScreen = connect(mapStateToProps, mapDispatchToProps)(SoloStreaksScreenComponent);

export { SoloStreaksScreen };
