import React, { PureComponent } from 'react';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { Screens } from './Screens';
import { Text, Card } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFlame } from '@fortawesome/pro-solid-svg-icons';
import { LongestEverStreak } from '@streakoid/streakoid-models/lib/Models/LongestEverStreak';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

interface LongestEverStreakCardProps {
    navigation: StackNavigationProp<RootStackParamList>;
    longestEverStreak: LongestEverStreak;
}

class LongestEverStreakCard extends PureComponent<LongestEverStreakCardProps> {
    render() {
        const { navigation } = this.props;
        const { numberOfDays } = this.props.longestEverStreak;
        if (this.props.longestEverStreak.streakType === StreakTypes.solo) {
            const { startDate, endDate, soloStreakId, soloStreakName } = this.props.longestEverStreak;
            const startDateDateString = startDate ? new Date(startDate).toDateString() : new Date().toDateString();
            return (
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate(Screens.SoloStreakInfo, {
                            _id: soloStreakId,
                            streakName: soloStreakName || '',
                            isUsersStreak: false,
                        })
                    }
                >
                    <Card>
                        <Text h4 style={{ textAlign: 'center' }}>
                            <FontAwesomeIcon icon={faFlame} color={numberOfDays > 0 ? 'gold' : 'grey'} />
                            {numberOfDays}
                        </Text>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Longest ever streak</Text>
                        <Text style={{ textAlign: 'center' }}>{soloStreakName}</Text>
                        <Text style={{ fontStyle: 'italic', textAlign: 'center' }}>
                            {startDateDateString}-{endDate ? new Date(endDate).toDateString() : 'Now'}
                        </Text>
                    </Card>
                </TouchableOpacity>
            );
        }
        if (this.props.longestEverStreak.streakType === StreakTypes.challenge) {
            const { challengeStreakId, challengeName, startDate, endDate } = this.props.longestEverStreak;
            const startDateDateString = startDate ? new Date(startDate).toDateString() : new Date().toDateString();
            return (
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate(Screens.ChallengeStreakInfo, {
                            _id: challengeStreakId,
                            challengeName: challengeName || '',
                        })
                    }
                >
                    <Card>
                        <Text h4 style={{ textAlign: 'center' }}>
                            <FontAwesomeIcon icon={faFlame} color={numberOfDays > 0 ? 'gold' : 'grey'} />
                            {numberOfDays}
                        </Text>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Longest ever streak</Text>
                        <Text style={{ textAlign: 'center' }}>{challengeName}</Text>
                        <Text style={{ fontStyle: 'italic', textAlign: 'center' }}>
                            {startDateDateString}-{endDate ? new Date(endDate).toDateString() : 'Now'}
                        </Text>
                    </Card>
                </TouchableOpacity>
            );
        }
        if (this.props.longestEverStreak.streakType == StreakTypes.teamMember) {
            const { startDate, endDate, teamStreakId, teamStreakName } = this.props.longestEverStreak;
            const startDateDateString = startDate ? new Date(startDate).toDateString() : new Date().toDateString();
            return (
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate(Screens.TeamStreakInfo, {
                            _id: teamStreakId || '',
                            streakName: teamStreakName || '',
                            userIsApartOfStreak: false,
                        })
                    }
                >
                    <Card>
                        <Text h4 style={{ textAlign: 'center' }}>
                            <FontAwesomeIcon icon={faFlame} color={numberOfDays > 0 ? 'gold' : 'grey'} />
                            {numberOfDays}
                        </Text>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Longest ever streak</Text>
                        <Text style={{ textAlign: 'center' }}>{teamStreakName}</Text>
                        <Text style={{ fontStyle: 'italic', textAlign: 'center' }}>
                            {startDateDateString}-{endDate ? new Date(endDate).toDateString() : 'Now'}
                        </Text>
                    </Card>
                </TouchableOpacity>
            );
        }
        return (
            <Card>
                <Text h4 style={{ textAlign: 'center' }}>
                    <FontAwesomeIcon icon={faFlame} color={'grey'} />
                    {0}
                </Text>
                <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Longest ever streak</Text>
            </Card>
        );
    }
}

export { LongestEverStreakCard };
