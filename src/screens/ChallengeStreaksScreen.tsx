import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationState, NavigationParams, ScrollView } from 'react-navigation';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { View, StyleSheet, AppState as ReactNativeAppState, ActivityIndicator } from 'react-native';
import { Text, Button } from 'react-native-elements';

import { AppState } from '../../store';
import { Spacer } from '../components/Spacer';
import { HamburgerSelector } from '../components/HamburgerSelector';
import { challengeStreakActions } from '../actions/sharedActions';
import { LiveChallengeStreakList } from '../components/LiveChallengeStreakList';
import { ArchivedChallengeStreakList } from '../components/ArchivedChallengeStreakList';
import NavigationService from './NavigationService';
import { Screens } from './Screens';
import { faPlus, faArchive } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { MaximumNumberOfFreeStreaksMessage } from '../components/MaximumNumberOfFreeStreaksMessage';
import { MAXIMUM_NUMBER_OF_FREE_STREAKS } from '../../config';
import { ProgressBar } from '../components/ProgressBar';
import { getCompletePercentageForStreaks } from '../helpers/getCompletePercentageForStreaks';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';

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

interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationProps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
});

class ChallengeStreaksScreenComponent extends PureComponent<Props> {
    static navigationOptions = ({
        navigation,
    }: {
        navigation: NavigationScreenProp<
            NavigationState,
            { isPayingMember: boolean; totalLiveStreaks: number; getMultipleLiveChallengeStreaksIsLoading: boolean }
        >;
    }) => {
        const isPayingMember = navigation.getParam('isPayingMember');
        const totalLiveStreaks = navigation.getParam('totalLiveStreaks');
        const getMultipleLiveChallengeStreaksIsLoading = navigation.getParam(
            'getMultipleLiveChallengeStreaksIsLoading',
        );
        const userHasReachedFreeStreakLimit = !isPayingMember && totalLiveStreaks > MAXIMUM_NUMBER_OF_FREE_STREAKS;
        return {
            title: 'Challenge Streaks',
            headerRight: (
                <Button
                    type="clear"
                    icon={<FontAwesomeIcon icon={faPlus} size={30} />}
                    onPress={() => {
                        if (!userHasReachedFreeStreakLimit) {
                            return NavigationService.navigate(Screens.Challenges);
                        }
                        NavigationService.navigate(Screens.Upgrade);
                    }}
                />
            ),
            headerLeft: () => (
                <View style={{ flexDirection: 'row' }}>
                    <HamburgerSelector navigation={navigation} />
                    {getMultipleLiveChallengeStreaksIsLoading ? <ActivityIndicator /> : null}
                </View>
            ),
        };
    };

    componentDidMount() {
        const { isPayingMember, totalLiveStreaks } = this.props;
        this.props.navigation.setParams({ isPayingMember, totalLiveStreaks });
    }

    componentDidUpdate(prevProps: Props) {
        const { getMultipleLiveChallengeStreaksIsLoading } = this.props;
        if (prevProps.getMultipleLiveChallengeStreaksIsLoading !== getMultipleLiveChallengeStreaksIsLoading) {
            this.props.navigation.setParams({ getMultipleLiveChallengeStreaksIsLoading });
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
            getArchivedChallengeStreaks,
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
                    {!isPayingMember ? (
                        <View style={{ marginLeft: 15, marginTop: 15 }}>
                            <MaximumNumberOfFreeStreaksMessage
                                isPayingMember={isPayingMember}
                                totalLiveStreaks={totalLiveStreaks}
                            />
                        </View>
                    ) : null}
                    <ProgressBar
                        progress={getCompletePercentageForStreaks({
                            numberOfIncompleteStreaks: incompleteChallengeStreaks.length,
                            numberOfStreaks: totalNumberOfChallengeStreaks,
                        })}
                    />
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
                            getArchivedChallengeStreaks={getArchivedChallengeStreaks}
                            archivedChallengeStreaks={archivedChallengeStreaks}
                            getMultipleArchivedChallengeStreaksIsLoading={getArchivedChallengeStreaksIsLoading}
                            navigation={this.props.navigation}
                        />
                    </Spacer>
                </View>
            </ScrollView>
        );
    }
}

const ChallengeStreaksScreen = connect(mapStateToProps, mapDispatchToProps)(ChallengeStreaksScreenComponent);

export { ChallengeStreaksScreen };
