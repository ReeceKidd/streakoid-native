import React, { PureComponent } from 'react';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { Screens } from './Screens';
import { Text, Card } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screenNavigation/RootNavigator';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFlame } from '@fortawesome/pro-solid-svg-icons';

interface LongestChallengeStreakCardProps {
    navigation: StackNavigationProp<RootStackParamList>;
    challengeStreakId: string;
    challengeName: string;
    numberOfDays: number;
    startDate: string;
    endDate?: string;
}

class LongestChallengeStreakCard extends PureComponent<LongestChallengeStreakCardProps> {
    render() {
        const { challengeStreakId, challengeName, numberOfDays, startDate, endDate } = this.props;
        if (!startDate) {
            return (
                <Card>
                    <Text h4 style={{ textAlign: 'center' }}>
                        <FontAwesomeIcon icon={faFlame} color={'grey'} />0
                    </Text>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Longest challenge streak</Text>
                </Card>
            );
        }
        return (
            <TouchableOpacity
                onPress={() =>
                    this.props.navigation.navigate(Screens.ChallengeStreakInfo, {
                        _id: challengeStreakId,
                        challengeName: challengeName,
                    })
                }
            >
                <Card>
                    <Text h4 style={{ textAlign: 'center' }}>
                        <FontAwesomeIcon icon={faFlame} color={endDate ? 'grey' : 'red'} />
                        {numberOfDays}
                    </Text>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Longest challenge streak</Text>
                    <Text style={{ textAlign: 'center' }}>{challengeName}</Text>
                    <Text style={{ fontStyle: 'italic', textAlign: 'center' }}>
                        {new Date(startDate).toDateString()}-{endDate ? new Date(endDate).toDateString() : 'Now'}
                    </Text>
                </Card>
            </TouchableOpacity>
        );
    }
}

export { LongestChallengeStreakCard };
