import React, { Component } from 'react';

import { Card, Text } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalculator } from '@fortawesome/pro-solid-svg-icons';

interface AverageStreakCardProps {
    averageStreak: number;
}

class AverageStreakCard extends Component<AverageStreakCardProps> {
    render(): JSX.Element {
        const { averageStreak } = this.props;
        return (
            <Card>
                <FontAwesomeIcon icon={faCalculator} size={20} />
                <Text h4 style={{ textAlign: 'center' }}>
                    {averageStreak.toFixed(2)}
                </Text>
                <Text style={{ textAlign: 'center' }}>{`Your average streak`}</Text>
            </Card>
        );
    }
}

export { AverageStreakCard };
