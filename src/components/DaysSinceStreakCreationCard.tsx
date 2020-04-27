import React, { Component } from 'react';

import { Card, Text } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBirthdayCake } from '@fortawesome/pro-solid-svg-icons';

interface DaysSinceStreakCreationCardProps {
    daysSinceStreakCreation: number;
}

class DaysSinceStreakCreationCard extends Component<DaysSinceStreakCreationCardProps> {
    render(): JSX.Element {
        const { daysSinceStreakCreation } = this.props;
        return (
            <Card>
                <FontAwesomeIcon icon={faBirthdayCake} size={20} />
                <Text h4 style={{ textAlign: 'center' }}>
                    {daysSinceStreakCreation}
                </Text>
                <Text style={{ textAlign: 'center' }}>Days passed since streak creation</Text>
            </Card>
        );
    }
}

export { DaysSinceStreakCreationCard };
