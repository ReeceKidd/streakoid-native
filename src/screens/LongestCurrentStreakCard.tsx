import React, { PureComponent } from 'react';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { Screens } from './Screens';
import { Text, Card } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFlame } from '@fortawesome/pro-solid-svg-icons';
import { LongestCurrentStreak } from '@streakoid/streakoid-models/lib/Models/LongestCurrentStreak';

interface LongestCurrentStreakCardProps {
    navigation: StackNavigationProp<RootStackParamList>;
    longestCurrentStreak: LongestCurrentStreak;
}

class LongestCurrentStreakCard extends PureComponent<LongestCurrentStreakCardProps> {
    render() {
        const { navigation } = this.props;
        const {
            numberOfDays,
            soloStreakId,
            soloStreakName,
            challengeStreakId,
            challengeName,
            teamMemberStreakId,
            teamStreakId,
            teamStreakName,
            startDate,
            endDate,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } = this.props.longestCurrentStreak as any;
        const startDateDateString = startDate ? new Date(startDate).toDateString() : new Date().toDateString();
        if (soloStreakId) {
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
                            <FontAwesomeIcon icon={faFlame} color={endDate ? 'grey' : 'red'} />
                            {numberOfDays}
                        </Text>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Longest current streak</Text>
                        <Text style={{ textAlign: 'center' }}>{soloStreakName}</Text>
                        <Text style={{ fontStyle: 'italic', textAlign: 'center' }}>
                            {startDateDateString}-{'Now'}
                        </Text>
                    </Card>
                </TouchableOpacity>
            );
        }
        if (challengeStreakId) {
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
                            <FontAwesomeIcon icon={faFlame} color={endDate ? 'grey' : 'red'} />
                            {numberOfDays}
                        </Text>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Longest current streak</Text>
                        <Text style={{ textAlign: 'center' }}>{challengeName}</Text>
                        <Text style={{ fontStyle: 'italic', textAlign: 'center' }}>
                            {startDateDateString}-{'Now'}
                        </Text>
                    </Card>
                </TouchableOpacity>
            );
        }
        if (teamMemberStreakId) {
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
                            <FontAwesomeIcon icon={faFlame} color={endDate ? 'grey' : 'red'} />
                            {numberOfDays}
                        </Text>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Longest current streak</Text>
                        <Text style={{ textAlign: 'center' }}>{teamStreakName}</Text>
                        <Text style={{ fontStyle: 'italic', textAlign: 'center' }}>
                            {startDateDateString}-{'Now'}
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
                <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Longest current streak</Text>
            </Card>
        );
    }
}

export { LongestCurrentStreakCard };
