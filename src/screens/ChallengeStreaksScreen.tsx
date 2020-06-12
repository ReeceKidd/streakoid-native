import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { View, StyleSheet, AppState as ReactNativeAppState } from 'react-native';
import { Text } from 'react-native-elements';

import { AppState } from '../../store';
import { Spacer } from '../components/Spacer';
import { challengeStreakActions } from '../actions/authenticatedSharedActions';
import { LiveChallengeStreakList } from '../components/LiveChallengeStreakList';
import { ArchivedChallengeStreakList } from '../components/ArchivedChallengeStreakList';
import { Screens } from './Screens';
import { faArchive } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { MaximumNumberOfFreeStreaksMessage } from '../components/MaximumNumberOfFreeStreaksMessage';
import { ProgressBar } from '../components/ProgressBar';
import { getCompletePercentageForStreaks } from '../helpers/getCompletePercentageForStreaks';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';
import { ChallengeStreaksStackParamList } from '../screenNavigation/ChallengeStreaksStack';

const getIncompleteChallengeStreaks = (state: AppState) => {
    return (
        state &&
        state.challengeStreaks &&
        state.challengeStreaks.liveChallengeStreaks &&
        state.challengeStreaks.liveChallengeStreaks.filter(
            (challengeStreak) => !challengeStreak.completedToday && challengeStreak.status === StreakStatus.live,
        )
    );
};

const mapStateToProps = (state: AppState) => {
    const liveChallengeStreaks = state && state.challengeStreaks && state.challengeStreaks.liveChallengeStreaks;
    const archivedChallengeStreaks = state && state.challengeStreaks && state.challengeStreaks.archivedChallengeStreaks;
    const getMultipleLiveChallengeStreaksIsLoading =
        state && state.challengeStreaks && state.challengeStreaks.getMultipleLiveChallengeStreaksIsLoading;
    const getArchivedChallengeStreaksIsLoading =
        state && state.challengeStreaks && state.challengeStreaks.getArchivedChallengeStreaksIsLoading;
    const totalNumberOfChallengeStreaks = state.challengeStreaks.liveChallengeStreaks.length;
    const currentUser = state && state.users && state.users.currentUser;
    const totalLiveStreaks = currentUser && currentUser.totalLiveStreaks;
    const isPayingMember =
        currentUser && currentUser.membershipInformation && currentUser.membershipInformation.isPayingMember;
    const incompleteChallengeStreaks = getIncompleteChallengeStreaks(state);
    return {
        liveChallengeStreaks,
        archivedChallengeStreaks,
        getMultipleLiveChallengeStreaksIsLoading,
        getArchivedChallengeStreaksIsLoading,
        timezone: currentUser.timezone,
        totalNumberOfChallengeStreaks,
        currentUser,
        totalLiveStreaks,
        isPayingMember,
        incompleteChallengeStreaks,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    completeChallengeStreakListTask: bindActionCreators(
        challengeStreakActions.completeChallengeStreakListTask,
        dispatch,
    ),
    incompleteChallengeStreakListTask: bindActionCreators(
        challengeStreakActions.incompleteChallengeStreakListTask,
        dispatch,
    ),
    getLiveChallengeStreaks: bindActionCreators(challengeStreakActions.getLiveChallengeStreaks, dispatch),
    getChallengeStreak: bindActionCreators(challengeStreakActions.getChallengeStreak, dispatch),
    getArchivedChallengeStreaks: bindActionCreators(challengeStreakActions.getArchivedChallengeStreaks, dispatch),
});

type ChallengeStreaksScreenNavigationProp = StackNavigationProp<
    ChallengeStreaksStackParamList,
    Screens.ChallengeStreaks
>;

type NavigationProps = {
    navigation: ChallengeStreaksScreenNavigationProp;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class ChallengeStreaksScreenComponent extends PureComponent<Props> {
    componentDidMount() {
        const { isPayingMember, totalLiveStreaks } = this.props;
        this.props.navigation.setParams({ isPayingMember, totalLiveStreaks });
        this.props.getArchivedChallengeStreaks();
    }

    componentDidUpdate(prevProps: Props) {
        const { getMultipleLiveChallengeStreaksIsLoading } = this.props;
        if (prevProps.getMultipleLiveChallengeStreaksIsLoading !== getMultipleLiveChallengeStreaksIsLoading) {
            this.props.navigation.setParams({
                getMultipleLiveChallengeStreaksIsLoading: getMultipleLiveChallengeStreaksIsLoading,
            });
        }
    }

    componentWillUnmount() {
        ReactNativeAppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState: string) => {
        if (nextAppState === 'active') {
            this.props.getLiveChallengeStreaks();
        }
    };

    render(): JSX.Element {
        const {
            getLiveChallengeStreaks,
            getChallengeStreak,
            completeChallengeStreakListTask,
            incompleteChallengeStreakListTask,
            liveChallengeStreaks,
            getMultipleLiveChallengeStreaksIsLoading,
            totalNumberOfChallengeStreaks,
            archivedChallengeStreaks,
            getArchivedChallengeStreaksIsLoading,
            currentUser,
            isPayingMember,
            incompleteChallengeStreaks,
        } = this.props;
        const totalLiveStreaks = currentUser && currentUser.totalLiveStreaks;
        return (
            <ScrollView style={styles.container}>
                <View>
                    <ProgressBar
                        completePercentage={getCompletePercentageForStreaks({
                            numberOfIncompleteStreaks: incompleteChallengeStreaks.length,
                            numberOfStreaks: totalNumberOfChallengeStreaks,
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
                        <LiveChallengeStreakList
                            navigation={this.props.navigation}
                            getLiveChallengeStreaks={getLiveChallengeStreaks}
                            getMultipleLiveChallengeStreaksIsLoading={getMultipleLiveChallengeStreaksIsLoading}
                            completeChallengeStreakListTask={completeChallengeStreakListTask}
                            incompleteChallengeStreakListTask={incompleteChallengeStreakListTask}
                            liveChallengeStreaks={liveChallengeStreaks}
                            totalNumberOfChallengeStreaks={totalNumberOfChallengeStreaks}
                            getChallengeStreak={getChallengeStreak}
                            userId={currentUser._id}
                        />
                    </View>
                    <Spacer>
                        <Text style={{ fontWeight: 'bold' }}>
                            Archived Challenge Streaks <FontAwesomeIcon icon={faArchive} />
                        </Text>
                        <ArchivedChallengeStreakList
                            navigation={this.props.navigation}
                            archivedChallengeStreaks={archivedChallengeStreaks}
                            getMultipleArchivedChallengeStreaksIsLoading={getArchivedChallengeStreaksIsLoading}
                        />
                    </Spacer>
                </View>
            </ScrollView>
        );
    }
}

const ChallengeStreaksScreen = connect(mapStateToProps, mapDispatchToProps)(ChallengeStreaksScreenComponent);

export { ChallengeStreaksScreen };
