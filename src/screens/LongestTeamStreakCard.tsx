import React, { PureComponent } from 'react';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { Screens } from './Screens';
import { Text, Card } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFlame } from '@fortawesome/pro-solid-svg-icons';

interface LongestTeamStreakCardProps {
    navigation: StackNavigationProp<RootStackParamList>;
    teamStreakId: string;
    teamStreakName: string;
    numberOfDays: number;
    userIsApartOfTeamStreak: boolean;
    startDate: string;
    endDate?: string;
}

class LongestTeamStreakCard extends PureComponent<LongestTeamStreakCardProps> {
    render() {
        const { teamStreakId, teamStreakName, numberOfDays, userIsApartOfTeamStreak, startDate, endDate } = this.props;
        if (!startDate) {
            return (
                <Card>
                    <Text h4 style={{ textAlign: 'center' }}>
                        <FontAwesomeIcon icon={faFlame} color={'grey'} />0
                    </Text>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Longest team streak</Text>
                </Card>
            );
        }
        return (
            <TouchableOpacity
                onPress={() =>
                    this.props.navigation.navigate(Screens.TeamStreakInfo, {
                        _id: teamStreakId,
                        streakName: teamStreakName,
                        userIsApartOfStreak: userIsApartOfTeamStreak,
                    })
                }
            >
                <Card>
                    <Text h4 style={{ textAlign: 'center' }}>
                        <FontAwesomeIcon icon={faFlame} color={endDate ? 'grey' : 'red'} />
                        {numberOfDays}
                    </Text>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Longest team streak</Text>
                    <Text style={{ textAlign: 'center' }}>{teamStreakName}</Text>
                    <Text style={{ fontStyle: 'italic', textAlign: 'center' }}>
                        {new Date(startDate).toDateString()}-{endDate ? new Date(endDate).toDateString() : 'Now'}
                    </Text>
                </Card>
            </TouchableOpacity>
        );
    }
}

export { LongestTeamStreakCard };
