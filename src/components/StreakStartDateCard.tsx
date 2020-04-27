import React, { Component } from 'react';

import { Card, Text } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBaby } from '@fortawesome/pro-solid-svg-icons';

interface StreakStartDateCardProps {
    createdAt: Date;
}

class StreakStartDateCard extends Component<StreakStartDateCardProps> {
    render(): JSX.Element {
        const { createdAt } = this.props;

        return (
            <Card>
                <FontAwesomeIcon icon={faBaby} size={20} />
                <Text h4 style={{ textAlign: 'center' }}>
                    {createdAt.toDateString()}
                </Text>
                <Text style={{ textAlign: 'center' }}>Day you created this streak</Text>
            </Card>
        );
    }
}

export { StreakStartDateCard };
