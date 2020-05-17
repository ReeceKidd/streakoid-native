import React, { PureComponent } from 'react';
import { Card, Text } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPowerOff } from '@fortawesome/pro-solid-svg-icons';

interface StreakRestartsCardProps {
    numberOfRestarts: number;
}

class StreakRestartsCard extends PureComponent<StreakRestartsCardProps> {
    render(): JSX.Element {
        const { numberOfRestarts } = this.props;
        return (
            <Card>
                <FontAwesomeIcon icon={faPowerOff} />
                <Text h4 style={{ textAlign: 'center' }}>
                    {numberOfRestarts}
                </Text>
                <Text style={{ textAlign: 'center' }}>Number of restarts</Text>
            </Card>
        );
    }
}

export { StreakRestartsCard };
