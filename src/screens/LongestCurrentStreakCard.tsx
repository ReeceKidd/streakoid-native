import React, { PureComponent } from 'react';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { Screens } from './Screens';
import { Text, Card } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFlame } from '@fortawesome/pro-solid-svg-icons';
import { LongestCurrentStreak } from '@streakoid/streakoid-models/lib/Models/LongestCurrentStreak';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

interface LongestCurrentStreakCardProps {
    navigation: StackNavigationProp<RootStackParamList>;
    longestCurrentStreak: LongestCurrentStreak;
}

class LongestCurrentStreakCard extends PureComponent<LongestCurrentStreakCardProps> {
    render() {
        const { navigation } = this.props;
        const { numberOfDays } = this.props.longestCurrentStreak;

        if (this.props.longestCurrentStreak.streakType === StreakTypes.solo) {
            const { startDate, soloStreakId, soloStreakName } = this.props.longestCurrentStreak;
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
                            <FontAwesomeIcon icon={faFlame} color={'red'} />
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
        if (this.props.longestCurrentStreak.streakType === StreakTypes.challenge) {
            const { challengeStreakId, challengeName, startDate } = this.props.longestCurrentStreak;
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
                            <FontAwesomeIcon icon={faFlame} color={'red'} />
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
        if (this.props.longestCurrentStreak.streakType === StreakTypes.teamMember) {
            const { startDate, teamStreakId, teamStreakName } = this.props.longestCurrentStreak;
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
                            <FontAwesomeIcon icon={faFlame} color={'red'} />
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
