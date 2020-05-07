import React, { Component } from 'react';

import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationState, NavigationParams, ScrollView } from 'react-navigation';
import { AppActions } from '@streakoid/streakoid-shared/lib';
import { bindActionCreators, Dispatch } from 'redux';
import { View, StyleSheet } from 'react-native';
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

const mapStateToProps = (state: AppState) => {
    const liveChallengeStreaks = state && state.challengeStreaks && state.challengeStreaks.liveChallengeStreaks;
    const archivedChallengeStreaks = state && state.challengeStreaks && state.challengeStreaks.archivedChallengeStreaks;
    const getLiveChallengeStreaksIsLoading =
        state && state.challengeStreaks && state.challengeStreaks.getMultipleLiveChallengeStreaksIsLoading;
    const getArchivedChallengeStreaksIsLoading =
        state && state.challengeStreaks && state.challengeStreaks.getArchivedChallengeStreaksIsLoading;
    const totalNumberOfChallengeStreaks = state.challengeStreaks.liveChallengeStreaks.length;
    const { currentUser } = state.users;
    return {
        liveChallengeStreaks,
        archivedChallengeStreaks,
        getLiveChallengeStreaksIsLoading,
        getArchivedChallengeStreaksIsLoading,
        timezone: currentUser.timezone,
        totalNumberOfChallengeStreaks,
        currentUser,
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

class ChallengeStreaksScreenComponent extends Component<Props> {
    static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationState, {}> }) => {
        return {
            title: 'Challenge Streaks',
            headerLeft: () => <HamburgerSelector navigation={navigation} />,
            headerRight: (
                <Button
                    type="clear"
                    icon={<FontAwesomeIcon icon={faPlus} size={30} />}
                    onPress={() => NavigationService.navigate(Screens.Challenges)}
                />
            ),
        };
    };

    render(): JSX.Element {
        const {
            getLiveChallengeStreaks,
            getArchivedChallengeStreaks,
            getChallengeStreak,
            completeChallengeStreakListTask,
            incompleteChallengeStreakListTask,
            liveChallengeStreaks,
            getLiveChallengeStreaksIsLoading,
            totalNumberOfChallengeStreaks,
            archivedChallengeStreaks,
            getArchivedChallengeStreaksIsLoading,
            currentUser,
        } = this.props;
        return (
            <ScrollView style={styles.container}>
                <View>
                    <Spacer>
                        <LiveChallengeStreakList
                            navigation={this.props.navigation}
                            getLiveChallengeStreaks={getLiveChallengeStreaks}
                            getMultipleLiveChallengeStreaksIsLoading={getLiveChallengeStreaksIsLoading}
                            completeChallengeStreakListTask={completeChallengeStreakListTask}
                            incompleteChallengeStreakListTask={incompleteChallengeStreakListTask}
                            liveChallengeStreaks={liveChallengeStreaks}
                            totalNumberOfChallengeStreaks={totalNumberOfChallengeStreaks}
                            getChallengeStreak={getChallengeStreak}
                            userId={currentUser._id}
                        />
                    </Spacer>
                    <Spacer>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
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
