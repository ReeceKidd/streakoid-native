import React, { Component } from 'react';
import { Card, Text } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStamp } from '@fortawesome/pro-solid-svg-icons';
interface TotalNumberOfDaysCardProps {
    totalTimesTracked: number;
}

class TotalNumberOfDaysCard extends Component<TotalNumberOfDaysCardProps> {
    render(): JSX.Element {
        const { totalTimesTracked } = this.props;
        return (
            <Card>
                <FontAwesomeIcon icon={faStamp} size={20} />
                <Text h4 style={{ textAlign: 'center' }}>
                    {totalTimesTracked}
                </Text>
                <Text style={{ textAlign: 'center' }}>Number of times you tracked this streak</Text>
            </Card>
        );
    }
}

export { TotalNumberOfDaysCard };
