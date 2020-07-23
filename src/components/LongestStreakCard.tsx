/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { PureComponent } from 'react';
import { Card, Text } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFlame } from '@fortawesome/pro-solid-svg-icons';

interface LongestStreakCardProps {
    numberOfDays: number;
    startDate: Date;
    endDate?: Date;
}

class LongestStreakCard extends PureComponent<LongestStreakCardProps> {
    render(): JSX.Element {
        const { numberOfDays, startDate, endDate } = this.props;
        return (
            <Card>
                <Text h4 style={{ textAlign: 'center' }}>
                    <FontAwesomeIcon icon={faFlame} color={endDate ? 'grey' : 'red'} />
                    {numberOfDays}
                </Text>
                <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Longest streak</Text>
                <Text style={{ fontStyle: 'italic', textAlign: 'center' }}>
                    {new Date(startDate).toDateString()}-{endDate ? new Date(endDate).toDateString() : 'Now'}
                </Text>
            </Card>
        );
    }
}

export { LongestStreakCard };
