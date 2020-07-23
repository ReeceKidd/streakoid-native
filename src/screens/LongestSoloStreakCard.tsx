import React, { PureComponent } from 'react';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { Screens } from './Screens';
import { Text, Card } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFlame } from '@fortawesome/pro-solid-svg-icons';

interface LongestSoloStreakCardProps {
    navigation: StackNavigationProp<RootStackParamList>;
    isUsersStreak: boolean;
    soloStreakId: string;
    soloStreakName: string;
    numberOfDays: number;
    startDate: string;
    endDate?: string;
}

class LongestSoloStreakCard extends PureComponent<LongestSoloStreakCardProps> {
    render() {
        const { soloStreakId, isUsersStreak, soloStreakName, numberOfDays, startDate, endDate } = this.props;
        if (!startDate) {
            return (
                <Card>
                    <Text h4 style={{ textAlign: 'center' }}>
                        <FontAwesomeIcon icon={faFlame} color={'grey'} />0
                    </Text>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Longest solo streak</Text>
                </Card>
            );
        }
        return (
            <TouchableOpacity
                onPress={() =>
                    this.props.navigation.navigate(Screens.SoloStreakInfo, {
                        _id: soloStreakId,
                        streakName: soloStreakName,
                        isUsersStreak,
                    })
                }
            >
                <Card>
                    <Text h4 style={{ textAlign: 'center' }}>
                        <FontAwesomeIcon icon={faFlame} color={endDate ? 'grey' : 'red'} />
                        {numberOfDays}
                    </Text>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Longest solo streak</Text>
                    <Text style={{ textAlign: 'center' }}>{soloStreakName}</Text>
                    <Text style={{ fontStyle: 'italic', textAlign: 'center' }}>
                        {new Date(startDate).toDateString()}-{endDate ? new Date(endDate).toDateString() : 'Now'}
                    </Text>
                </Card>
            </TouchableOpacity>
        );
    }
}

export { LongestSoloStreakCard };
